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

        btn_reset: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.can_use_times = 1;
        this.answer_list = {};
        // cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;

        this.curr_index = scene_mgr.getInstance().curr_index;
        // let list_info = global_var.list[this.title_index - 1];

        this.text_content.string = "只移动自身1根火柴棒，哪些数字可以变成其他数字？";

        let chn_num_char = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "11", "12", "13"];
        this.text_title.string = "第" + chn_num_char[this.curr_index + 1] + "题";

        // 读题
        this.node_duti.on(cc.Node.EventType.TOUCH_END, function() {
            sound_mgr.getInstance().play_effect(this.audio_ti, false);
        }.bind(this), this);

        // 提交
        this.btn_tijiao.on(cc.Node.EventType.TOUCH_END, function() {
            this.submitAnswer();
        }.bind(this), this);

        this.btn_reset.on(cc.Node.EventType.TOUCH_START, function() {
            var scene = cc.director.getScene();
            cc.director.loadScene(scene.name);
        }.bind(this), this);

        this.node_nums = this.node_content2.getChildByName("node_nums");
        for (let i = 0; i <= 9; i++) {
            let node_name = "node_num_" + i;
            let node = this.node_nums.getChildByName(node_name);
            node.getComponent("common_num").opt_type = 3;
        }
    },
    start() {},
    // 提交答案
    submitAnswer() {
        if (this.is_over) {
            return;
        }
        this.is_over = true;

        this.is_win = this.get_result();
        var res = scene_mgr.getInstance().submitAnswer(this.curr_index, this.is_win);

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
    onDestroy() {
        this.node_duti.off(cc.Node.EventType.TOUCH_END);
        this.btn_tijiao.off(cc.Node.EventType.TOUCH_END);
    },
    // update (dt) {},
    change_num: function(curr_node, to_val, deltiems) {
        this.answer_list[to_val] = true;

        let node = this.node.getChildByName("node_all_nums");
        let common_all_nums = node.getComponent("common_all_nums");
        if (CC_DEBUG) {
            console.log("============common_all_nums.num_prefabs", common_all_nums.num_prefabs, to_val, curr_node.name);
        }
        let new_node = cc.instantiate(common_all_nums.num_prefabs[to_val]);
        new_node.scale = curr_node.scale;
        new_node.getComponent("common_num").opt_type = 3;
        curr_node.parent.addChild(new_node, curr_node.zIndex, curr_node.name);
        new_node.setPosition(curr_node.getPosition());
        let node_di = new_node.getChildByName("node_di");
        if (node_di) {
            node_di.active = false;
        }

        curr_node.removeFromParent();
    },
    get_result: function() {
        let sum = 0;
        for (let i = 0; i <= 9; i++) {
            let node_name = "node_num_" + i;
            let node = this.node_nums.getChildByName(node_name);
            let node_common_num = node.getComponent("common_num");
            let curr_val = node_common_num.get_num_value();

            if (node_common_num.get_mov_one_info(i)) {
                // 可移动
                if (curr_val !== -1 && curr_val !== i) {
                    sum++;
                }
            } else {
                if (curr_val === i) {
                    sum++;
                }
            }
        }
        if (CC_DEBUG) {
            console.log("============get_result 9 ", sum);
        }
        return sum === 10;
    },
});