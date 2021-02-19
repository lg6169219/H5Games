var net = require("net");
var tcppkg = require("../netbus/tcppkg.js");
var proto_man = require("../netbus/proto_man.js");
var test_talk_room_proto = require("./test_talk_room_proto");


var sock = net.connect({
    port: 6080,
    host: "127.0.0.1",
}, function() {
    console.log("connected to server!");
});

sock.on("connect", function() {
    console.log("connect success");

    // 1, 2, body = "hello talk room"
    // var cmd_buf = proto_man.encode_cmd(proto_man.PROTO_JSON, 1, 1, "hello talk room");
    var cmd_buf = proto_man.encode_cmd(proto_man.PROTO_BUF, 1, 1, { uname: "123", upwd: "321" });

    if (!cmd_buf) {
        console.log("cmd_buf error");
    } else {
        cmd_buf = tcppkg.package_data(cmd_buf);
        // cmd_buf = tcppkg.package_data("aaaaaa");
        sock.write(cmd_buf);
    }
});

sock.on("error", function() {});