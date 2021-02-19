var sound_manager = require("sound_manager");
var ugame = require("ugame");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anchor_center = this.node.getChildByName("anchor-center");

        this.start_button = this.anchor_center.getChildByName("start_anim_root").getChildByName("start_button_root").getChildByName("start_button");
        this.start_button.on(cc.Node.EventType.TOUCH_START, this.start_game, this);


        this.loading_door_comp = this.node.getChildByName("loading_door").getComponent("loading_door");

        // this.start_anim_com = this.anchor_center.getChildByName("start_anim_root").getComponent(cc.Animation);

        this.is_outside = false;
        this.game_started = false;
    },

    start() {
        // this.loading_door_comp.open_the_door(function() {
        // this.start_anim_com.play("home_scene_start_anim");
        // }.bind(this));

        cc.loader.loadRes("sounds/music/home_scene_bg", cc.AudioClip, function(err, clip) {
            sound_manager.play_music(clip, true);
        });
    },
    start_game: function() {
        if (this.game_started) {
            return;
        }
        this.game_started = true;

        cc.loader.loadRes("sounds/click", cc.AudioClip, function(err, clip) {
            sound_manager.play_effect(clip);
        });
        // 播放收起动画
        // this.start_anim_com.play("start_button_click_anim");

        // 第一次进入游戏 故事背景
        if (ugame.is_first_enter === true) {
            ugame.get_cur_user().is_first_enter = false;
            // 存到本地
            ugame.sync_user_data();

            this.node.getChildByName("node_black").active = true;
            var str_comp = this.node.getChildByName("node_black").getChildByName("node_label").getComponent(cc.Label);
            str_comp.string = "";
            var str = "距离垃圾魔王率领垃圾军团占领地球已经过去了一年，现在你要渡过重重难关，打败魔王，成为垃圾王";

            this.node.getChildByName("node_black").on(cc.Node.EventType.TOUCH_END, function() {
                // 玩家要快进
                this.unscheduleAllCallbacks();

                str_comp.string = str;

                console.log("=========11111");
                this.scheduleOnce(function() {
                    console.log("=========22222");
                    this.change_game_scene();
                }.bind(this), 0.8);
            }, this);


            var times = str.length - 1;
            var count = 0;
            this.schedule(function() {
                str_comp.string += str[count];
                if (count >= times) {
                    this.change_game_scene();
                }
                count++;
            }, 0.1, times);
        } else {
            this.change_game_scene();
        }
    },
    change_game_scene: function() {
        this.unscheduleAllCallbacks();

        // this.loading_door_comp.close_the_door(function() {
        this.scheduleOnce(function() {
                cc.director.loadScene("roadmap_scene");
            }, 0.5)
            // }.bind(this));
    },
    // set_star_num: function(user_node, user) {
    //     var lab_star_num = user_node.getChildByName("lab_star_num").getComponent(cc.Label);
    //     lab_star_num.string = user.star_num + '/' + user.star_total;
    // },
    // set_power_num: function(user_node, user) {
    //     var lab_power_num = user_node.getChildByName("lab_power_num").getComponent(cc.Label);
    //     lab_power_num.string = 1;
    // },
    // set_score_num: function(user_node, user) {
    //     var lab_score_num = user_node.getChildByName("lab_score_num").getComponent(cc.Label);
    //     lab_score_num.string = 2;
    // },
    // update (dt) {},
});