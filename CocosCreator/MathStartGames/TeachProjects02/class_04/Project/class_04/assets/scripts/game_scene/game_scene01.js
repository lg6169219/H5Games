// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var scene_mgr = require("../scene_manager");
var sound_mgr = require("../sound_manager");
var global_var = require("../global_var");
cc.Class({
    extends: cc.Component,

    properties: {
        text_title: {
            default: null,
            type: cc.Label
        },
        text_content: {
            default: null,
            type: cc.Label
        },
        node_content2: {
            default: null,
            type: cc.Node
        },
        btn_tijiao: {
            default: null,
            type: cc.Node
        },
        node_win: {
            default: null,
            type: cc.Node
        },
        node_lose: {
            default: null,
            type: cc.Node
        },

        node_duti: {
            default: null,
            type: cc.Node
        },

        audio_ti: {
            default: null,
            type: cc.AudioClip
        },

        node_rotate: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;

        this.curr_index = scene_mgr.getInstance().curr_index;
        // let list_info = global_var.list[this.title_index - 1];

        this.text_content.string = "将左侧的七巧板，拖拽到右侧对应区域，拼成指定的图形";

        let chn_num_char = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        this.text_title.string = "第" + chn_num_char[this.curr_index + 1] + "题";

        // 读题
        this.node_duti.on(cc.Node.EventType.TOUCH_END, function() {
            sound_mgr.getInstance().play_effect(this.audio_ti, false);
        }.bind(this), this);

        // 提交
        this.btn_tijiao.on(cc.Node.EventType.TOUCH_END, function() {
            this.submitAnswer();
        }.bind(this), this);

        this.node_rotate.on(cc.Node.EventType.TOUCH_END, function() {
            this.rotate_curr_node();
        }.bind(this), this);
    },

    rotate_curr_node: function() {
        scene_mgr.getInstance().rotate_curr_node();
    },

    // 提交答案
    submitAnswer() {
        if (this.is_over) {
            return;
        }
        this.is_over = true;

        var is_win = true;
        var node_use_list = this.node_content2.getChildByName("node_curr_use");
        for (var i = 0; i < node_use_list.children.length; i++) {
            if (node_use_list.children[i].group === "node_use") {
                var curr_node = node_use_list.children[i];
                var is_right_position = curr_node.getComponent("common_piece").is_right_position;
                if (is_right_position === false) {
                    is_win = false;
                    break;
                }
            }
        }

        var res = scene_mgr.getInstance().submitAnswer(this.curr_index, is_win);

        let has_next = global_var.list[this.curr_index + 1];

        var use_node = null;
        if (res === true) {
            this.node_win.active = true;
            this.node_lose.active = false;
            use_node = this.node_win;
        } else {
            this.node_win.active = false;
            this.node_lose.active = true;
            use_node = this.node_lose;
        }

        if (use_node && use_node != null) {
            var audio = use_node.getComponent(cc.AudioSource);
            audio.play();
            use_node.scale = 0;
            var s = cc.scaleTo(0.4, 1).easing(cc.easeBackOut());
            use_node.runAction(s);

            var node_next = use_node.getChildByName("node_next");
            var node_final = use_node.getChildByName("node_final");
            var node_mash = use_node.getChildByName("New Sprite(Splash)");
            node_mash.on(cc.Node.EventType.TOUCH_START, function() {

            }.bind(this), this);

            if (has_next) {
                node_next.active = true;
                node_final.active = false;

                var node_btn = node_next.getChildByName("button");
                node_btn.on(cc.Node.EventType.TOUCH_START, this.gotoNextTitle, this);
            } else {
                node_next.active = false;
                node_final.active = true;

                var btn_restart = node_final.getChildByName("btn_restart");
                var btn_done = node_final.getChildByName("btn_done");
                btn_restart.on(cc.Node.EventType.TOUCH_START, this.replay, this);
                btn_done.on(cc.Node.EventType.TOUCH_END, function() {
                    scene_mgr.getInstance().sendResAnswer();
                }, this);
            }
        }
    },
    // 下一题
    gotoNextTitle() {
        scene_mgr.getInstance().gotoNextTitle();
    },
    replay() {
        scene_mgr.getInstance().replay();
    },
    start() {},
    onDestroy() {
        this.node_duti.off(cc.Node.EventType.TOUCH_END);
        this.btn_tijiao.off(cc.Node.EventType.TOUCH_END);
    },
    // update (dt) {},
});