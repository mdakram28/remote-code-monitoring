const fs = require("fs");
const gcno_file =
    "/media/mdakram28/Data/projects/hda/hda-server/example/sources/cov_files/fib.gcno";

function readRecordHeader(data) {
    return {
        tag: data.readUInt32LE(0),
        length: data.readUInt32LE(4)
    };
}

function readRecord(data) {
    var ret = {
        header: readRecordHeader(data.slice(0, 8)),
        data: {}
    };
    return ret;
}

fs.readFile(gcno_file, (err, data) => {
    console.log(data);
    var parsed = {
        header: {
            magicString: data
                .slice(0, 4)
                .reverse()
                .toString(),
            version: data.readUIntBE(4, 4)
        }
    };

    parsed = {
        ...parsed,
        record: readRecord(data.slice(16))
    };

    console.log(JSON.stringify(parsed, null, 4));
});
