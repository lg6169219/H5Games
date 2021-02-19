var ui_ctrl = require("ui_ctrl");
var ui_manager = require("ui_manager");
var game_app = require("game_app");

cc.Class({
	extends: ui_ctrl,

	properties: {
	},

	onLoad() {
		ui_ctrl.prototype.onLoad.call(this);

		this.add_button_listen("btn_start", this, this.on_start_btn_click);
	},

	start() {
	},

	on_start_btn_click : function(){
		game_app.Instance.enter_home_scene();
	},
});