var ui_ctrl = require("ui_ctrl");
var UI_manager = require("UI_manager");
cc.Class({
    extends: ui_ctrl,

    properties: {},

    onLoad() {
        ui_ctrl.prototype.onLoad.call(this);
    },

    start() {
        console.log("========aaa", this.view);

        // var click_event = new cc.Component.EventHandler();
        // click_event.target = this.node;
        // click_event.component = this.node.name + "_ctrl";
        // click_event.handler = "on_login_click";
        // this.view["btn_1"].getComponent(cc.Button).clickEvents.push(click_event);

        this.add_button_listen(this.view["btn_1"], this, on_login_click);

        var Label_1 = this.view["btn_1/Label"];
        Label_1.getComponent(cc.Label).string = "1111";
    },

    on_login_click: function() {
        console.log("========on_login_click");
    },
});