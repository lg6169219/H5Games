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
        upgrade_config: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.level_num = 20;

        this.outside = false;

        this.anchor_bottom = this.node.getChildByName("anchor-bottom");
        this.btn_encyclopedia = this.anchor_bottom.getChildByName("btn_encyclopedia");
        // this.btn_upgrad = this.anchor_bottom.getChildByName("btn_upgrad");
        // this.btn_upgrad.on(cc.Node.EventType.TOUCH_START, this.on_upgrade_config_click, this);
        this.anchor_bottom.getChildByName("btn_back").on(cc.Node.EventType.TOUCH_START, this.back_home_scene, this);


        this.anchor_center = this.node.getChildByName("anchor-center");
        // 关卡入口节点保存
        this.new_level_entry = this.anchor_center.getChildByName("new_level_entry");
        this.new_level_entry.active = false;

        this.map_entry_root = this.anchor_center.getChildByName("map_entry_root");
        this.passed_entry = [];
        console.log(this.level_num);
        for (let i = 1; i <= this.level_num; i++) {
            let node_name = "level" + i;
            let node_level = this.map_entry_root.getChildByName(node_name);
            node_level.level = i;
            node_level.on(cc.Node.EventType.TOUCH_START, this.on_pass_entry_click, this);
            this.passed_entry.push(node_level);
        }

        // test 使用clickevent注册点击事件
        // let node_name = "level1";
        // let node_level = this.map_entry_root.getChildByName(node_name);
        // let bt = node_level.getComponent(cc.Button);
        // // 或者使用clickevent
        // let event_handler = new cc.Component.EventHandler();
        // event_handler.target = this.node;
        // event_handler.component = "roadmap_scene";
        // event_handler.handler = "on_pass_entry_click";
        // event_handler.customEventData = "1";
        // bt.clickEvents.push(event_handler);

        this.new_level = -1;
    },

    start() {
        cc.loader.loadRes("sounds/music/roadmap_scene_bg", cc.AudioClip, function(err, clip) {
            sound_manager.play_music(clip, true);
        });

        this.loading_door_comp = this.node.getChildByName("loading_door").getComponent("loading_door");
        this.loading_door_comp.open_the_door();

        this._show_game_level_info();
        this._show_user_star_info();
    },

    back_home_scene: function() {
        if (this.go_back) {
            return;
        }
        this.go_back = true;

        this.loading_door_comp.close_the_door(function() {
            cc.director.loadScene("home_scene", function() {
                var home_scene = cc.find("UI_ROOT").getComponent("home_scene");
            });
        }.bind(this));
    },

    // 新的没有挑战的关卡点击
    on_new_entry_click: function() {
        if (this.outside) {
            return;
        }
        this.outside = true;

        ugame.add_chip(360);

        this._goto_game_scene(this.new_level);
    },
    // 已结挑战的关卡点击进入 level从1开始
    on_pass_entry_click: function(event) {
        if (this.outside) {
            return;
        }
        this.outside = true;

        let level = parseInt(event.target.level);
        this._goto_game_scene(level - 1);
    },
    // 技能升级界面按钮
    on_upgrade_config_click: function() {
        this.upgrade_config.active = true;
        this.upgrade_config.getComponent(cc.Animation).play("upgrade_config_enter_anim");
    },
    _goto_game_scene: function(level) {
        // 保存当前level
        ugame.set_cur_level(level);

        // 跳转到游戏场景
        this.loading_door_comp.close_the_door(function() {
            cc.director.loadScene("game_scene");
        }.bind(this));
    },

    _show_game_level_info: function() {
        var cur_user = ugame.get_cur_user();
        var level_info = cur_user.level_info;

        var i = 0;
        var len = (level_info.length < this.passed_entry.length) ? level_info.length : this.passed_entry.length;
        console.log("=========len", len, level_info.length, this.passed_entry.length);
        for (; i < len; i++) {
            let star_num = level_info[i];
            if (star_num === 0) {
                break;
            }
            this.passed_entry[i].active = true;
            this.passed_entry[i].getComponent("level_entry_info").show_level_star_info(star_num);
        }

        // 当前最新能挑战的i
        this.new_level = i;
        if (this.new_level >= this.level_num) {
            // 全部挑战成功
            this.new_level_entry.active = false;
        } else {
            this.new_level_entry.active = true;
            this.new_level_entry.x = this.passed_entry[this.new_level].x;
            this.new_level_entry.y = this.passed_entry[this.new_level].y;
        }
        // 后面的
        for (; i < this.level_num; i++) {
            this.passed_entry[i].active = false;
        }
    },
    _show_user_star_info: function() {
        // var lab_num = this.node.getChildByName("anchor-top-right").getChildByName("game_star_info").getChildByName("lab_num").getComponent(cc.Label);
        // var cur_user = ugame.get_cur_user();
        // lab_num.string = cur_user.star_num + "/" + cur_user.star_total;
    },

    // update (dt) {},
});