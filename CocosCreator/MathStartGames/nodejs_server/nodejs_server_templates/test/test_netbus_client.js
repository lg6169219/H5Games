var net = require("net");
var netpkg = require("./tcppkg");
var log = require("../utils/log");

var sock = net.connect({
    port: 6080,
    host: "127.0.0.1",
}, function() {
    log.info("connected to server");
});

sock.on("connect", function() {
    log.info("connect success");

    var buf_set = netpkg.package_data("hello");

    sock.write(buf_set);
});

sock.on("error", function(err) {
    log.info("error ", err);
});

sock.on("close", function() {
    log.info("close");
});