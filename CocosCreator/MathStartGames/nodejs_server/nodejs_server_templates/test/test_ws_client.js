var ws = require("ws");

var sock = new ws("ws://127.0.0.1:6081");
sock.on("open", function() {
    sock.send("hello world");
    sock.send(Buffer.alloc(10));
});

sock.on("error", function(err) {});

sock.on("close", function(err) {});

sock.on("message", function(data) {
    console.log(data);
});