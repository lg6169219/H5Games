var ui_ctrl = require("ui_ctrl");
var ui_manager = require("ui_manager");
var game_app = require("game_app");

cc.Class({
	extends: ui_ctrl,

	properties: {
	},

	onLoad() {
		ui_ctrl.prototype.onLoad.call(this);
		this.max_level = 20;
		this.curr_level = 1;
		this.curr_select_level = this.curr_level;

		this.show_node_pass();
	},

	start() {
	},

	show_node_pass: function(){
		var node_curr = this.view["node_curr"];
		this.add_button_listen("node_curr", this, this.enter_game_scene);
		node_curr.active = false;
		

		for(var i = 1; i <= this.max_level; i++){
			var node_pass = this.view["node_pass" + i];
			this.add_button_listen("node_pass" + i, this, this.enter_game_scene);

			if(this.curr_level > i){
				node_pass.active = true;
			}else if(this.curr_level < i){
				node_pass.active = false;
			}else{
				node_pass.active = false;
				node_curr.active = true;
				node_curr.setPosition(node_pass.getPosition());
			}
		}
	},


	enter_game_scene: function(){
		console.log("=========11111", this.curr_select_level);
		game_app.Instance.enter_game_scene(this.curr_select_level);
	},
});