var utils = require("utils");
var ugame = require("ugame");

cc.Class({
    extends: cc.Component,

    properties: {
        game_tips: {
            default: [],
            type: cc.String
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.failed_root = this.node.getChildByName("failed_root");
        this.successed_root = this.node.getChildByName("successed_root");
        this.tip = this.failed_root.getChildByName("tip");

        this.failed_root.getChildByName("replay").on(cc.Node.EventType.TOUCH_END, this.restart_game, this);
        this.failed_root.getChildByName("exit").on(cc.Node.EventType.TOUCH_END, this.exit_game, this);

        this.successed_root.getChildByName("replay").on(cc.Node.EventType.TOUCH_END, this.restart_game, this);
        this.successed_root.getChildByName("exit").on(cc.Node.EventType.TOUCH_END, this.exit_game, this);

        this.failed_root.active = false;
        this.successed_root.active = false;

        this.node.active = false;

        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
    },

    start() {

    },

    show_failed_tip: function() {
        var num = utils.random_int(0, this.game_tips.lenght - 1);
        this.tip.getComponent(cc.Label).string = this.game_tips[num || 0];
    },
    show_failed: function() {
        this.node.active = true;

        this.failed_root.active = true;
        this.successed_root.active = false;

        this.show_failed_tip();
    },

    restart_game: function() {
        this.game_scene.start_game();
        this.node.active = false;
    },

    exit_game: function() {
        this.game_scene.back_home_scene();
        this.node.active = false;
    },

    show_successed: function(curr_blood, max_blood) {
        this.node.active = true;

        this.failed_root.active = false;
        this.successed_root.active = true;

        // 评星
        var score = 0;
        if (curr_blood >= max_blood * 0.8) {
            score = 3;
        } else if (curr_blood >= max_blood * 0.4) {
            score = 2;
        } else {
            score = 1;
        }

        for (var i = 1; i <= 3; i++) {
            var star_bg = this.successed_root.getChildByName("star_" + i);
            var star = star_bg.getChildByName("star");
            if (i <= score) {
                star.active = true;
            } else {
                star.active = false;
            }
        }

        var cur_user = ugame.get_cur_user();
        var cur_level = ugame.get_cur_level();

        if (score > cur_user.level_info[cur_level]) {
            var add_value = score - cur_user.level_info[cur_level];
            cur_user.level_info[cur_level] = score;
            cur_user.star_num += add_value;
            ugame.sync_user_data();
        }
    },
    // update (dt) {},
});