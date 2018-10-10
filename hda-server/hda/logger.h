#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/time.h>
#include <pthread.h>
#include <netdb.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <errno.h>
#include <sys/uio.h>
#include <string.h>
#include <stdarg.h>
#include <dirent.h>
#include <sys/resource.h>
#include <math.h>

#define PACKET_SEND_DELAY 100000
#define GCDA_START_OFFSET 100
#define PACKET_INFO_START 40

void __gcov_flush(void);

clock_t start, stop;
int fd;
struct addrinfo *res = 0;
char buffer[10000];
FILE *fptr;
// struct rusage r_usage;
char *gcda_filename;
char gcda_full_filename[30];
pthread_mutex_t packet_mutex;
char *pid_str;

void run_coverage()
{
	__gcov_flush();
}

long long current_time_millis()
{
	struct timespec spec;
	clock_gettime(CLOCK_REALTIME, &spec);
	return (spec.tv_nsec / 1.0e6) + ((long long)spec.tv_sec) * 1000;
}

void setup_udp()
{
	const char *hostname = HOST; /* localhost */
	const char *portname = "5000";
	struct addrinfo hints;
	memset(&hints, 0, sizeof(hints));
	hints.ai_family = AF_UNSPEC;
	hints.ai_socktype = SOCK_DGRAM;
	hints.ai_protocol = 0;
	hints.ai_flags = AI_ADDRCONFIG;
	int err = getaddrinfo(hostname, portname, &hints, &res);
	if (err != 0)
	{
		fprintf(stderr, "failed to resolve remote socket address (err=%d)", err);
	}

	fd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
	if (fd == -1)
	{
		fprintf(stderr, "%s", strerror(errno));
	}
}

void delete_file(char *fileName)
{
	int status;
	status = remove(fileName);

	if (status != 0)
	{
		printf("Unable to delete the file\n");
		perror("Error");
	}
}

void delete_gcda_files()
{
	struct dirent *de;
	DIR *dir = opendir(pid_str);
	if( dir == NULL) {
		return;
	}
	while ((de = readdir(dir)) != NULL)
	{
		char *dot = strrchr(de->d_name, '.');
		if (dot && !strcmp(dot, ".gcda"))
		{
			delete_file(de->d_name);
		}
	}
	// printf("sadsadsa------------d");;
	closedir(dir);
}

void get_gcda_filename()
{
	struct dirent *de;
	DIR *dir = opendir(pid_str);
	if( dir == NULL) {
		printf("Null Directory");
		return;
	}
	while ((de = readdir(dir)) != NULL)
	{
		char *dot = strrchr(de->d_name, '.');
		if (dot && !strcmp(dot, ".gcda"))
		{
			gcda_filename = de->d_name;
			strcpy(gcda_full_filename, pid_str);
			strcat(gcda_full_filename, "/");
			strcat(gcda_full_filename, gcda_filename);
			closedir(dir);
			return;
		}
	}
	closedir(dir);
}

int parseLine(char* line){
    // This assumes that a digit will be found and the line ends in " Kb".
    int i = strlen(line);
    const char* p = line;
    while (*p <'0' || *p > '9') p++;
    line[i-3] = '\0';
    i = atoi(p);
    return i;
}

int getMemoryUsage(){ //Note: this value is in KB!
    FILE* file = fopen("/proc/self/status", "r");
    int result = -1;
    char line[128];

    while (fgets(line, 128, file) != NULL){
        if (strncmp(line, "VmSize:", 7) == 0){
            result = parseLine(line);
            break;
        }
    }
    fclose(file);
    return result;
}

void put_resource_stats_in_packet()
{
	// getrusage(RUSAGE_SELF, &r_usage);
	sprintf(buffer + PACKET_INFO_START, "%d;", getMemoryUsage());
}

void put_process_info_in_packet()
{
	// sprintf(buffer, "%s%ll%d", gcda_filename, current_time_millis, getpid());
	sprintf(buffer, "%s;%lld;%d;", gcda_filename, current_time_millis(), getpid());
}

void send_coverage_packet()
{
	pthread_mutex_lock(&packet_mutex);
	int size;
	run_coverage();
	put_resource_stats_in_packet();
	fptr = fopen(gcda_full_filename, "r");
	if (fptr == NULL)
	{
		printf("Cannot read data \n");
		exit(0);
	}
	size = fread(buffer + GCDA_START_OFFSET, sizeof(buffer) - GCDA_START_OFFSET, 1, fptr);
	fseek(fptr, 0L, SEEK_END);
	size = ftell(fptr);
	if (sendto(fd, buffer, size + GCDA_START_OFFSET, 0, res->ai_addr, res->ai_addrlen) == -1)
	{
		fprintf(stderr, "%s", strerror(errno));
	}
	fclose(fptr);
	pthread_mutex_unlock(&packet_mutex);
}

void *probe_thread(void *vargp)
{
	delete_gcda_files();
	run_coverage();
	get_gcda_filename();
	put_process_info_in_packet();
	setup_udp();
	while (1)
	{
		start = clock();
		send_coverage_packet();
		stop = clock();
		usleep(PACKET_SEND_DELAY);
	}
}

void sig_handler(int sig)
{
	exit(0);
}

void exit_handler()
{
	send_coverage_packet();
	delete_file(gcda_full_filename);
	delete_file(pid_str);
}

void set_gcov_env() {
	setenv("GCOV_PREFIX_STRIP", "10", 1);
	int pid = getpid();
	pid_str = (char *)malloc((int)((ceil(log10(pid))+1)*sizeof(char)));
	sprintf(pid_str, "%d", pid);
	printf("%s", pid_str);
	setenv("GCOV_PREFIX", pid_str, 1);
}

void __attribute__((constructor)) setup()
{
	pthread_t thread_id;
	setbuf(stdout, NULL);

	set_gcov_env();

	signal(SIGTERM, sig_handler);
	signal(SIGABRT, sig_handler);
	signal(SIGINT, sig_handler);
	signal(SIGQUIT, sig_handler);
	signal(SIGKILL, sig_handler);
	signal(SIGSTOP, sig_handler);
	atexit(exit_handler);

	pthread_create(&thread_id, NULL, probe_thread, NULL);
	// printf("Probe setup complete for %s\n", __FILE__);
}
