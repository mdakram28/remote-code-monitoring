var udp = require("dgram");
var parser = require("./parser");
var fs = require("fs");
var exec = require("child_process").exec;
var path = require("path");

const GCDA_START_OFFSET = 100;
const PACKET_INFO_START = 40;

// --------------------creating a udp server --------------------

// creating a udp server

function getSourceFolder(sources, fileName) {
    for (var source in sources) {
        for (var file in sources[source]) {
            file = sources[source][file];
            if (
                file.substring(0, file.lastIndexOf(".")) ==
                fileName.substring(0, file.lastIndexOf("."))
            ) {
                return {
                    dir: source,
                    file: file
                };
            }
        }
    }
}

function getProgress(stdout) {
    console.log(stdout);
    files = stdout
        .toString()
        .match(/'(\w+\.)+(c|h)'/g)
        .map(function(f) {
            return f.replace(/'/g, "");
        });
    percent = stdout.toString().match(/\d+\.\d+% of \d+/g);
    var ret = {};
    if (!percent) return ret;
    for (var i = 0; i < files.length; i++) {
        ret[files[i]] = {
            percent: parseFloat(
                percent[i].substring(0, percent[i].indexOf("%"))
            ),
            total: parseFloat(
                percent[i].substring(percent[i].indexOf("of ") + 3)
            )
        };
    }
    // console.log(files, percent);
    console.log(ret);
    return ret;
}

module.exports = function(onReceiveFile, store) {
    function execIfIsFirst(packet, done) {
        if (!store.timeline[packet.fileName]) {
            // First time packet received
            // Copy gcno file
            packet.gcnoFilename = packet.fileName.replace(/\.gcda$/g, ".gcno");
            exec(
                `mkdir -p ${packet.dataDir};` +
                    `cd ${packet.dataDir};` +
					`cp ../${packet.gcnoFilename} ${packet.gcnoFilename};` +
					`cp ../../${packet.sourceDir.file} .`,
                done
            );
        } else {
            done();
        }
    }

    function execCov(packet, done) {
        var command =
            `cd ${packet.dataDir};` +
			`gcov ${packet.sourceDir.file} -m -r;`;
			console.log(command);
        exec(command, done);
    }

    function saveCovHistory(packet, cov_json, done) {
        fs.appendFile(packet.historyFile, JSON.stringify(cov_json)+"\n", done);
    }

    function getCov(packet, cov_stdout, done) {
        fs.readFile(packet.covFile, function(err, data) {
            if (err) done(err);
            else {
                var content = parser.parse_coverage(data.toString());
                content.time = packet.timeReceived;
                content.memory = packet.memoryUsage;
                content.progress = getProgress(cov_stdout);
                content.runId = packet.runId;
                content.startTime = packet.startTime;
                content.sourceDir = packet.sourceDir.dir;
                store.timeline[packet.sourceDir.file] =
                    store.timeline[packet.sourceDir.file] || {};
                store.timeline[packet.sourceDir.file][packet.runId] =
                    store.timeline[packet.sourceDir.file][packet.runId] || {};
                store.timeline[packet.sourceDir.file][packet.runId][
                    packet.timeReceived
                ] = content;
                saveCovHistory(packet, content, function(err) {
                    if (err) console.error(err);
                    done(null, content);
                });
            }
        });
    }

    var server = udp.createSocket("udp4");

    // emits when any error occurs
    server.on("error", function(error) {
        console.log("Error: " + error);
        server.close();
    });
    var i = 0;
    // var memBuf = new Buffer();
    // emits on new datagram msg
    var process_info_buffer = new Buffer(PACKET_INFO_START);
    var packet_info_buffer = new Buffer(GCDA_START_OFFSET - PACKET_INFO_START);
    server.on("message", function(msg, info) {
        var timeReceived = new Date().getTime();
        var packet = {};

        // get process stats
        msg.copy(process_info_buffer, 0, 0);
        var process_stats_tokens = process_info_buffer.toString().split(";");
        packet.fileName = process_stats_tokens[0];
        packet.startTime = process_stats_tokens[1];
        packet.processId = process_stats_tokens[2];
        packet.sourceDir = getSourceFolder(store.sources, packet.fileName);
        if (!packet.sourceDir) {
            console.log(
                "Received packet from unknown source : " + packet.fileName
            );
            return;
        }
        packet.runId =
            packet.sourceDir.file +
            "-" +
            packet.startTime +
            "-" +
            packet.processId;
        packet.dataDir = path.join(
            packet.sourceDir.dir,
            "cov_files",
            packet.runId
        );
        packet.historyFile = path.join(packet.dataDir, "history.json");

        // get resource stats
        msg.copy(packet_info_buffer, 0, PACKET_INFO_START);
        var packet_info_tokens = packet_info_buffer.toString().split(";");
        packet.memoryUsage = parseInt(packet_info_tokens[0]);

        // get file
        var file = new Buffer(msg.length - GCDA_START_OFFSET);
        msg.copy(file, 0, GCDA_START_OFFSET);
        packet.gcdaFilePath = path.join(packet.dataDir, packet.fileName);
        packet.covFile = path
            .join(packet.dataDir, packet.sourceDir.file + ".gcov")
            .toString();

        execIfIsFirst(packet, function(err, cp_stdout, cp_stderr) {
            if (err || cp_stderr) return console.error(cp_stderr);
            fs.writeFile(packet.gcdaFilePath, file, function(err) {
                if (err) return console.error(err);
                execCov(packet, function(err, cov_stdout, cov_stderr) {
                    if (err || cov_stderr)
                        return console.error("Coverage error : " + cov_stderr);
                    getCov(packet, cov_stdout, function(err, content) {
                        if (err) return console.error(err);
                        onReceiveFile(
                            packet.sourceDir.file,
                            packet.runId,
                            content
                        );
                    });
                });
            });
        });

        console.log(
            "Received %d bytes from %s:%d %s",
            msg.length,
            info.address,
            info.port,
            packet.runId
        );
    });

    //emits when socket is ready and listening for datagram msgs
    server.on("listening", function() {
        var address = server.address();
        var port = address.port;
        var family = address.family;
        var ipaddr = address.address;
        console.log("Server is listening at port " + port);
        console.log("Server ip :" + ipaddr);
        console.log("Server is IP4/IP6 : " + family);
    });

    //emits after the socket is closed using socket.close();
    server.on("close", function() {
        console.log("Socket is closed !");
    });

    server.bind(5000);
};
