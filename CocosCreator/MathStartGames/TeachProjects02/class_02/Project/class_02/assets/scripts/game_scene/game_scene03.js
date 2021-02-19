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
        // cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;

        this.curr_index = scene_mgr.getInstance().curr_index;
        // let list_info = global_var.list[this.title_index - 1];

        this.text_content.string = "请点击对应位置，去掉1根火柴棒，使下面的算式成立。";

        let chn_num_char = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "11", "12", "13"];
        this.text_title.string = "第" + chn_num_char[this.curr_index + 1] + "题";

        // this.prepare_game();

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

        this.can_use_times = 1;

        for (let i = 1; i <= 4; i++) {
            let node_name = "node_" + i;
            let node = this.node_content2.getChildByName(node_name);
            node.getComponent("common_num").opt_type = 1;
        }
    },

    // 准备数据
    prepare_game: function() {
        this.can_sub_times = 1;
        // 可以去掉的数组
        this.can_add_node_list = {
            node_1: { // 3
            },
            node_2: {
                node_6: { is_right: true }
            },
            node_3: {
                node_1: { is_right: false }
            },
        };
    },

    start_game: function() {
        this.curr_add_node = null;

        for (let i = 1; i <= 3; i++) {
            let num_node_name = "node_" + i;
            let num_node = this.node_content2.getChildByName(num_node_name);
            let num_node_list = this.can_add_node_list[num_node_name];
            for (let j = 1; j < 8; j++) {
                let node_name = "node_" + j
                let curr_node = num_node.getChildByName(node_name);
                if (num_node_list[node_name]) {
                    curr_node.on(cc.Node.EventType.TOUCH_START, function() {
                        // console.log(this.can_move_times);
                        if (this.can_sub_times <= 0) {
                            return;
                        }
                        // if (this.curr_drag_node && this.curr_drag_node != null){
                        //     return;
                        // }
                        // this.start_x = curr_node.x;
                        // this.start_y = curr_node.y;
                        // this.curr_drag_node = curr_node;

                        this.can_sub_times--;
                        curr_node.removeFromParent();
                        // this.curr_add_node = cc.instantiate(this.prefab_add_stick);
                        // num_node.addChild(this.curr_add_node);
                        // this.curr_add_node.setPosition(curr_node.getPosition());

                        // if(curr_node.name == "node_1" || curr_node.name == "node_2" || curr_node.name == "node_3"){
                        //     this.end_angle = 90; 
                        // }else{
                        //     this.end_angle = 0;
                        // }
                        // this.curr_add_node.angle = this.end_angle;

                        this.is_win = num_node_list[node_name].is_right;
                    }.bind(this), this);
                    // curr_node.on(cc.Node.EventType.TOUCH_MOVE, function(e){
                    //     // if (this.can_move_times <= 0){
                    //     //     return;
                    //     // }
                    //     // var delta = e.getDelta();
                    //     // curr_node.x += delta.x;
                    //     // curr_node.y += delta.y;
                    // }.bind(this), this);
                    // curr_node.on(cc.Node.EventType.TOUCH_END, function(e){
                    //     // var w_pos = e.getLocation();
                    //     // this.is_in_right_round(num_node_list[node_name], curr_node);
                    // }.bind(this), this);
                    // curr_node.on(cc.Node.EventType.TOUCH_CANCEL, function(e){
                    //     // var w_pos = e.getLocation();
                    //     // this.is_in_right_round(num_node_list[node_name], curr_node);
                    // }.bind(this), this);
                }
            }
        }
    },

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
    start() {
        // this.start_game();
    },
    sub_one_stick: function(curr_node, change_val) {
        this.can_use_times--;
    },
    change_num: function(curr_node, to_val, deltiems) {
        if (deltiems === true) {
            this.can_use_times--;
        }


        let node = this.node.getChildByName("node_all_nums");
        let common_all_nums = node.getComponent("common_all_nums");
        if (CC_DEBUG) {
            console.log("============common_all_nums.num_prefabs", common_all_nums.num_prefabs, to_val, curr_node.name);
        }
        let new_node = cc.instantiate(common_all_nums.num_prefabs[to_val]);
        new_node.scale = curr_node.scale;
        new_node.getComponent("common_num").opt_type = 1;
        this.node_content2.addChild(new_node, curr_node.zIndex, curr_node.name);
        new_node.setPosition(curr_node.getPosition());

        curr_node.removeFromParent();
    },
    get_result: function() {
        let node_1 = this.node_content2.getChildByName("node_1");
        let node_1_common = node_1.getComponent("common_num");

        let node_2 = this.node_content2.getChildByName("node_2");
        let node_2_common = node_2.getComponent("common_num");
        let fuhao1 = node_2_common.get_num_value();

        let val1 = node_1_common.get_num_value();

        let node_3 = this.node_content2.getChildByName("node_3");
        let node_3_common = node_3.getComponent("common_num");
        let val2 = node_3_common.get_num_value();

        let node_4 = this.node_content2.getChildByName("node_4");
        let node_4_common = node_4.getComponent("common_num");

        let var_res = node_4_common.get_num_value();

        let var_pre = 0
        if (fuhao1 === 10) {
            var_pre = val1 + val2;
        } else {
            var_pre = val1 - val2;
        }
        return var_pre === var_res;
    },
    onDestroy() {
        this.node_duti.off(cc.Node.EventType.TOUCH_END);
        this.btn_tijiao.off(cc.Node.EventType.TOUCH_END);
    },
    // update (dt) {},
});