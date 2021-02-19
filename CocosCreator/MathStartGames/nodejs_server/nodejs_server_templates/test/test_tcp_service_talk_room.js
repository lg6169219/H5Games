var log = require("../utils/log.js");
var test_talk_room_proto = require("./test_talk_room_proto");

var service = {
    stype: 1, // 服务号
    name: "talk room", // 服务名称

    // 每个服务初始化的时候调用
    init: function() {
        log.info(this.name + " service init");
    },

    // 每个服务收到数据的时候调用
    on_recv_player_cmd: function(session, ctype, body) {
        log.info(this.name + " on_recv_player_cmd: ", ctype, body);
    },

    // 每个服务连接丢失后调用(被动丢失连接，主动退出在on_recv_cmd接收相应数据)
    on_player_disconnection: function(session) {
        log.info(this.name + " on_player_disconnection: ", session.session_key);
    }
};

module.exports = service;