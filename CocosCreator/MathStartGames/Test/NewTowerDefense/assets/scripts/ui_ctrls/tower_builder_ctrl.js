var ui_ctrl = require("ui_ctrl");
var ui_manager = require("ui_manager");

cc.Class({
    extends: ui_ctrl,

    properties: {},

    onLoad() {
        ui_ctrl.prototype.onLoad.call(this);

        cc.log(this.getComponent(cc.Button), this.view);
    },

    start() {},

});