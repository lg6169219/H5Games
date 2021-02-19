var netbus = require("../netbus/netbus");
var proto_man = require("../netbus/proto_man.js")


var tcp_server = netbus.start_tcp_server("127.0.0.1", 6080, proto_man.PROTO_BUF);
var tcp_server = netbus.start_tcp_server("127.0.0.1", 6081, proto_man.PROTO_JSON);

var ws_server = netbus.start_ws_server("127.0.0.1", 6082, proto_man.PROTO_BUF);
var ws_server = netbus.start_ws_server("127.0.0.1", 6083, proto_man.PROTO_JSON);


var service_manager = require("../netbus/service_manager.js");
var test_tcp_service_talk_room = require("./test_tcp_service_talk_room.js");
service_manager.register_service(1, test_tcp_service_talk_room);