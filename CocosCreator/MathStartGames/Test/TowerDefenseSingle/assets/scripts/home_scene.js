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

        this.about_button = this.anchor_center.getChildByName("start_anim_root").getChildByName("about_button_root").getChildByName("about_button");
        this.about_button.on(cc.Node.EventType.TOUCH_START, this.show_about, this);

        this.loading_door_comp = this.node.getChildByName("loading_door").getComponent("loading_door");

        this.start_anim_com = this.anchor_center.getChildByName("start_anim_root").getComponent(cc.Animation);
        this.user_game_info_anim_com = this.anchor_center.getChildByName("user_game_info_root").getComponent(cc.Animation);

        this.anchor_center.getChildByName("user_game_info_root").getChildByName("btn_back").on(cc.Node.EventType.TOUCH_START, this.hide_user_info, this);

        this.is_outside = false;
        this.game_started = false;
    },

    start() {
        this.loading_door_comp.open_the_door(function() {
            this.start_anim_com.play("home_scene_start_anim");
        }.bind(this));

        cc.loader.loadRes("sounds/music/home_scene_bg", cc.AudioClip, function(err, clip) {
            sound_manager.play_music(clip, true);
        });

        // 填充玩家数据
        this.show_user_info();
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
        this.start_anim_com.play("start_button_click_anim");

        // 获取当前动画时间，播放角色数据弹出动画
        this.scheduleOnce(function() {
            this.user_game_info_anim_com.play("userinfo_enter_anim");
        }.bind(this), this.start_anim_com.currentClip.duration);
    },

    show_about: function() {
        if (this.is_outside) {
            return;
        }
        this.is_outside = true;

        cc.loader.loadRes("sounds/click", cc.AudioClip, function(err, clip) {
            sound_manager.play_effect(clip);
        });

        this.loading_door_comp.close_the_door(function() {
            this.scheduleOnce(function() {
                cc.director.loadScene("about_scene");
            }, 0.5)
        }.bind(this));
    },

    hide_user_info: function() {
        this.user_game_info_anim_com.play("reverse_userinfo_enter_anim");
        this.scheduleOnce(function() {
            this.start_anim_com.play("reverse_start_button_click_anim");
            this.game_started = false;
        }.bind(this), this.user_game_info_anim_com.currentClip.duration);
    },

    // 填充玩家数据
    show_user_info: function() {
        for (let i = 0; i <= 2; i++) {
            let user_node = this.anchor_center.getChildByName("user_game_info_root").getChildByName("node_user" + (i + 1));
            user_node.user_index = i;
            this.set_star_num(user_node, ugame.user_data[i]);
            this.set_power_num(user_node, ugame.user_data[i]);
            this.set_score_num(user_node, ugame.user_data[i]);
            user_node.on(cc.Node.EventType.TOUCH_START, this.on_user_entry_click, this);
        }
    },
    set_star_num: function(user_node, user) {
        var lab_star_num = user_node.getChildByName("lab_star_num").getComponent(cc.Label);
        lab_star_num.string = user.star_num + '/' + user.star_total;
    },
    set_power_num: function(user_node, user) {
        var lab_power_num = user_node.getChildByName("lab_power_num").getComponent(cc.Label);
        lab_power_num.string = 1;
    },
    set_score_num: function(user_node, user) {
        var lab_score_num = user_node.getChildByName("lab_score_num").getComponent(cc.Label);
        lab_score_num.string = 2;
    },
    on_user_entry_click: function(e) {
        let user_index = parseInt(e.target.user_index || 0);
        ugame.set_cur_user(user_index);

        cc.loader.loadRes("sounds/click", cc.AudioClip, function(err, clip) {
            sound_manager.play_effect(clip);
        });

        this.loading_door_comp.close_the_door(function() {
            this.scheduleOnce(function() {
                cc.director.loadScene("roadmap_scene");
            }, 0.5)
        }.bind(this));
    },
    // update (dt) {},
});