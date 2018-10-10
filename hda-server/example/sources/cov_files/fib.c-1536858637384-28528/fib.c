#include <stdio.h>
#include "logger.h"
#include <time.h>

int f(int n)
{
	usleep(1000);
	if (n == 0 || n == 1)
		return n;
	else
		return (f(n - 1) + f(n - 2));
}

int main()
{
	int i = 1, c;
	char *arr;
	
	for (c = 1; c <= 50; c++)
	{
		printf("%d\n", f(i));
		arr = (char *)malloc(10000000);
		sleep(1);
		i++;
	}

	return 0;
}
