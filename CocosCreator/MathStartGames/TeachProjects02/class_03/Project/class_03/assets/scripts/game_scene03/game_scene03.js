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
        text_content: {
            default: null,
            type: cc.Label
        },
        prefab_fruits: { // 0瓜1橙子2桃子
            default: [],
            type: cc.Prefab
        },
        prefab_lanzi: {
            default: null,
            type: cc.Prefab
        },
        node_content1: {
            default: null,
            type: cc.Node
        },
        node_content1_container: {
            default: null,
            type: cc.Node
        },
        node_content2: {
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
        title_index: 3,

        node_duti: {
            default: null,
            type: cc.Node
        },

        audio_ti: {
            default: null,
            type: cc.AudioClip
        },

        input_text1: { //输入文本框
            default: null,
            type: cc.EditBox
        },
        input_text2: { //输入文本框
            default: null,
            type: cc.EditBox
        },
        input_text3: { //输入文本框
            default: null,
            type: cc.EditBox
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.nodePool = new cc.NodePool('Xigua');

        let list_info = global_var.list[this.title_index - 1];

        this.num1 = list_info.dividend;
        this.num2 = list_info.divisor;

        // num3 正确答案12/3=4
        this.createLanzi();

        this.text_content.string = `春游活动开始了，妮妮带来了${this.num1}个汉堡分给大家，要平均放到${this.num2}个盘子里。每个盘子里放几个呢？`;

        this.start_pos_list = [];
        // content1

        for (var i = 0; i < this.num1; i++) {
            var fruit1 = cc.instantiate(this.prefab_fruits[0]);
            this.node_content1_container.addChild(fruit1);
        }
        this.node_content1_container.getComponent(cc.Layout).updateLayout();

        this.curr_fruit = null;
        this.init_all_nodes();

        // this.node_content1.on(cc.Node.EventType.TOUCH_START, function(e) {
        //     if (this.curr_fruit)
        //         return;

        //     var w_pos = e.getLocation();
        //     var pos = this.node.convertToNodeSpaceAR(w_pos);
        //     this.curr_fruit = this.nodePool.get();
        //     if (!this.curr_fruit) {
        //         this.curr_fruit = cc.instantiate(this.prefab_fruits[0]);
        //     }
        //     this.node.addChild(this.curr_fruit);
        //     this.curr_fruit.setPosition(pos);
        // }.bind(this), this);

        // this.node_content1.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
        //     if (!this.curr_fruit)
        //         return;

        //     var w_pos = e.getLocation();
        //     var pos = this.node.convertToNodeSpaceAR(w_pos);
        //     this.curr_fruit.setPosition(pos);
        // }.bind(this), this);

        // this.node_content1.on(cc.Node.EventType.TOUCH_END, function() {
        //     if (!this.curr_fruit)
        //         return;
        //     this.nodePool.put(this.curr_fruit);
        //     this.curr_fruit = null;
        // }.bind(this), this);

        // this.node_content1.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
        //     if (!this.curr_fruit)
        //         return;

        //     var w_pos = e.getLocation();
        //     this.isInRightRound(w_pos);
        // }.bind(this), this);

        // 读题
        this.node_duti.on(cc.Node.EventType.TOUCH_END, function() {
            sound_mgr.getInstance().play_effect(this.audio_ti, false);
        }.bind(this), this);
    },
    createLanzi: function() {
        for (var i = 0; i < this.num2; i++) {
            let node_lanzi = cc.instantiate(this.prefab_lanzi)
            this.node_content2.addChild(node_lanzi);
        }

        this.node_content2.getComponent(cc.Layout).updateLayout();
    },
    isInRightRound(pos, index) {
        var is_collide = false;
        for (var i = 0; i < this.node_content2.children.length; i++) {
            if (this.node_content2.children[i].group === "lanzi") {
                var curr_node = this.node_content2.children[i];
                var new_pos = curr_node.convertToWorldSpaceAR(cc.v2(0, 0));

                var a = new cc.Rect(new_pos.x - curr_node.width / 2, new_pos.y - curr_node.height / 2, curr_node.width, curr_node.height);
                var b = new cc.Vec2(pos.x, pos.y);
                // 产生了碰撞
                if (this.curr_fruit && a.contains(b)) {
                    is_collide = true;

                    // 1、删除
                    this.remove_node();
                    this.curr_fruit = null;

                    // 2、添加到篮子里
                    curr_node.getComponent("lanzi_control01").add_node();
                    break;
                }
            }
        }
        if (is_collide === false) {
            if (this.curr_fruit) {
                this.curr_fruit.setPosition(this.start_pos_list[index].x, this.start_pos_list[index].y);
                this.curr_fruit = null;
            }
        }
    },
    init_all_nodes: function() {
        for (let i = 0; i < this.node_content1_container.children.length; i++) {
            let curr_node = this.node_content1_container.children[i];
            if (curr_node.group == "node_prefab") {
                this.start_pos_list[i] = { x: curr_node.x, y: curr_node.y };

                curr_node.on(cc.Node.EventType.TOUCH_START, function(e) {
                    if (this.curr_fruit)
                        return;
                    let index = this.node_content1_container.parent.getSiblingIndex();
                    this.node_content1_container.parent.setSiblingIndex(index + 2);
                    this.curr_fruit = curr_node;
                }.bind(this), this);

                curr_node.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
                    if (!this.curr_fruit)
                        return;
                    var delta = e.getDelta();
                    this.curr_fruit.x += delta.x;
                    this.curr_fruit.y += delta.y;
                }.bind(this), this);

                curr_node.on(cc.Node.EventType.TOUCH_END, function(e) {
                    if (!this.curr_fruit)
                        return;

                    var w_pos = e.getLocation();
                    this.isInRightRound(w_pos, i);
                }.bind(this), this);

                curr_node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
                    if (!this.curr_fruit)
                        return;

                    var w_pos = e.getLocation();
                    this.isInRightRound(w_pos, i);
                }.bind(this), this);
            }
        }
    },
    remove_node() {
        if (!this.curr_fruit)
            return;
        // 这里不真的删除，只是active=false
        this.curr_fruit.active = false;
    },
    add_node() {
        for (let i = 0; i < this.node_content1_container.children.length; i++) {
            if (this.node_content1_container.children[i].group == "node_prefab" && this.node_content1_container.children[i].active === false) {
                this.node_content1_container.children[i].active = true;
                this.node_content1_container.children[i].setPosition(this.start_pos_list[i].x, this.start_pos_list[i].y);
                break;
            }
        }
    },
    // 提交答案
    submitAnswer() {
        if (this.is_over) {
            return;
        }
        this.is_over = true;

        var res_list = [];
        for (var i = 0; i < this.node_content2.children.length; i++) {
            if (this.node_content2.children[i].group === "lanzi") {
                var curr_node = this.node_content2.children[i];
                var res_num = curr_node.getComponent("lanzi_control01").get_num;
                res_list.push(res_num);
            }
        }
        let input_num1 = this.input_text1.string == "" ? 0 : parseInt(this.input_text1.string);
        let input_num2 = this.input_text2.string == "" ? 0 : parseInt(this.input_text2.string);
        let input_num3 = this.input_text3.string == "" ? 0 : parseInt(this.input_text3.string);

        var res = scene_mgr.getInstance().submitAnswer(this.title_index, { dividend: this.num1, divisor: this.num2, res: res_list }, { dividend: input_num1, divisor: input_num2, res: input_num3 }, true);
        if (res === true) {
            this.node_win.active = true;
            // 音效和动画
            var audio = this.node_win.getComponent(cc.AudioSource);
            audio.play();
            this.node_win.scale = 0;
            var s = cc.scaleTo(0.4, 1).easing(cc.easeBackOut());
            this.node_win.runAction(s);

            this.node_lose.active = false;
            var node_btn = this.node_win.getChildByName("button");
            node_btn.on(cc.Node.EventType.TOUCH_START, this.gotoNextTitle, this);
        } else {
            this.node_win.active = false;
            this.node_lose.active = true;

            var audio = this.node_lose.getComponent(cc.AudioSource);
            audio.play();
            this.node_lose.scale = 0;
            var s = cc.scaleTo(0.4, 1).easing(cc.easeBackOut());
            this.node_lose.runAction(s);

            var node_btn = this.node_lose.getChildByName("button");
            node_btn.on(cc.Node.EventType.TOUCH_START, this.gotoNextTitle, this);
        }
    },
    // 下一题
    gotoNextTitle() {
        scene_mgr.getInstance().gotoNextTitle();
    },
    start() {
        this.node_content1_container.getComponent(cc.Layout).enabled = false;
        this.node_content2.getComponent(cc.Layout).enabled = false;
    },
    replay() {
        scene_mgr.getInstance().replay();
    },
    send_answer() {
        scene_mgr.getInstance().sendResAnswer();
    },
    // update (dt) {},
});