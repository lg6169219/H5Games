var proto_man = require("./proto_man.js");
var log = require("../utils/log.js");

var service_modules = {};

function register_service(stype, service) {
    if (service_modules[stype]) {
        log.warn(service_modules[stype].name + "service is registe !!! ");
    }

    service.init();
    service_modules[stype] = service;
}

function on_recv_client_cmd(session, str_or_buf) {
    // 根据协议解码收到的数据
    var cmd = proto_man.decode_cmd(session.proto_type, str_or_buf);
    if (!cmd) {
        return false;
    }

    var stype, ctype, body;
    stype = cmd[0];
    ctype = cmd[1];
    body = cmd[2];

    log.info("on_recv_client_cmd ", stype, ctype, body);

    // service_modules里找到相应的服务
    if (service_modules[stype]) {
        service_modules[stype].on_recv_player_cmd(session, ctype, body);
    }
    return true;
}
// 玩家掉线走这里
function on_client_lost_connect(session) {
    log.warn("session lost ", session.session_key);
    // 变量所有的服务模块，通知在这个服务上的这个玩家掉线了
    for (var key in service_modules) {
        service_modules[key].on_player_disconnection(session);
    }
}

var service_manager = {
    on_client_lost_connect: on_client_lost_connect,
    on_recv_client_cmd: on_recv_client_cmd,
    register_service: register_service,
};

module.exports = service_manager;