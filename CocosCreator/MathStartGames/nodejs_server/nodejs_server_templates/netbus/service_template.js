var service = {
    stype: 1, // 服务号
    name: "service template", // 服务名称

    // 每个服务初始化的时候调用
    init: function() {
        log.info(this.name + " service init");
    },

    // 每个服务收到数据的时候调用
    on_recv_player_cmd: function(session, ctype, body) {},

    // 每个服务连接丢失后调用(被动丢失连接，主动退出在on_recv_cmd接收相应数据)
    on_player_disconnection: function(session) {}
};

module.exports = service;