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
        prefab_denghao: {
            default: null,
            type: cc.Prefab
        },
        node_content1: {
            default: null,
            type: cc.Node
        },
        node_content2: {
            default: null,
            type: cc.Node
        },
        node_content3: {
            default: null,
            type: cc.Node
        },
        node_lanzi: {
            default: null,
            type: cc.Node
        },
        node_listen: {
            default: null,
            type: cc.Node
        },
        btn_tijiao: {
            default: null,
            type: cc.Button
        },
        node_win: {
            default: null,
            type: cc.Node
        },
        node_lose: {
            default: null,
            type: cc.Node
        },
        title_index: 1,

        node_duti: {
            default: null,
            type: cc.Node
        },

        audio_ti: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.taoziPool = new cc.NodePool('TaoZi');
        this.answerNum = 0; // 答案

        this.text_content.string = "海豚博士带来了小朋友最爱吃的橙子，小伙伴都想用自己的水果来换好吃的橙子，小朋友们，你知道小伙伴能换到多少橙子吗?";
        // 1瓜 = 3橙子
        // 2菠萝=4橙子
        // 1瓜1菠萝=？橙子
        // content1
        var list_info = global_var.list[this.title_index - 1];

        for (var i = 0; i < list_info.content1_left; i++) {
            var fruit1 = cc.instantiate(this.prefab_fruits[0]);
            this.node_content1.addChild(fruit1);
        }
        var denghao1 = cc.instantiate(this.prefab_denghao);
        this.node_content1.addChild(denghao1);

        for (var i = 0; i < list_info.content1_right; i++) {
            let fruit3 = cc.instantiate(this.prefab_fruits[2]);
            this.node_content1.addChild(fruit3);
        }

        // content2
        for (var i = 0; i < list_info.content2_left; i++) {
            let fruit2 = cc.instantiate(this.prefab_fruits[1]);
            this.node_content2.addChild(fruit2);
        }
        var denghao2 = cc.instantiate(this.prefab_denghao);
        this.node_content2.addChild(denghao2);
        for (var i = 0; i < list_info.content2_right; i++) {
            let fruit3 = cc.instantiate(this.prefab_fruits[2]);
            this.node_content2.addChild(fruit3);
        }

        // content2
        for (var i = 0; i < list_info.content3_left; i++) {
            let fruit1 = cc.instantiate(this.prefab_fruits[0]);
            this.node_content3.addChild(fruit1);
        }
        for (var i = 0; i < list_info.content3_right; i++) {
            let fruit2 = cc.instantiate(this.prefab_fruits[1]);
            this.node_content3.addChild(fruit2);
        }
        var denghao3 = cc.instantiate(this.prefab_denghao);
        this.node_content3.addChild(denghao3);

        // 篮子 缓冲池？

        this.curr_fruit = null;
        this.remove_fruit = null;

        var actionBy1 = cc.rotateTo(0.5, -1);
        var actionBy2 = cc.rotateTo(0.5, 1);
        var seq = cc.sequence(actionBy1, actionBy2);
        this.node_lanzi.runAction(cc.repeatForever(seq));

        this.node_lanzi.on(cc.Node.EventType.TOUCH_START, function(e) {
            if (this.curr_fruit)
                return;

            var w_pos = e.getLocation();
            var pos = this.node.convertToNodeSpaceAR(w_pos);
            this.curr_fruit = this.taoziPool.get();
            if (!this.curr_fruit) {
                this.curr_fruit = cc.instantiate(this.prefab_fruits[2]);
            }
            this.node.addChild(this.curr_fruit);
            this.curr_fruit.setPosition(pos);
        }.bind(this), this);

        this.node_lanzi.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
            if (!this.curr_fruit)
                return;

            var w_pos = e.getLocation();
            var pos = this.node.convertToNodeSpaceAR(w_pos);
            this.curr_fruit.setPosition(pos);
        }.bind(this), this);

        this.node_lanzi.on(cc.Node.EventType.TOUCH_END, function() {
            if (!this.curr_fruit)
                return;
            this.taoziPool.put(this.curr_fruit);
            this.curr_fruit = null;
        }.bind(this), this);

        this.node_lanzi.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
            if (!this.curr_fruit)
                return;

            var w_pos = e.getLocation();
            this.isInRightRound(w_pos);
        }.bind(this), this);

        // 移除一个水果
        this.node_listen.on(cc.Node.EventType.TOUCH_START, function(e){
            if (this.remove_fruit)
                return;
            if (this.answerNum <= 0){
                return;
            }
            var w_pos = e.getLocation();
            var pos = this.node.convertToNodeSpaceAR(w_pos);
            this.remove_fruit = this.taoziPool.get();
            if (!this.remove_fruit) {
                this.remove_fruit = cc.instantiate(this.prefab_fruits[2]);
            }
            this.node.addChild(this.remove_fruit);
            this.remove_fruit.setPosition(pos);
        }.bind(this), this);

        this.node_listen.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
            if (!this.remove_fruit)
                return;

            var w_pos = e.getLocation();
            var pos = this.node.convertToNodeSpaceAR(w_pos);
            this.remove_fruit.setPosition(pos);
        }.bind(this), this);

        this.node_listen.on(cc.Node.EventType.TOUCH_END, function() {
            if (!this.remove_fruit)
                return;
            this.taoziPool.put(this.remove_fruit);
            this.remove_fruit = null;
        }.bind(this), this);

        this.node_listen.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
            if (!this.remove_fruit)
                return;
            var w_pos = e.getLocation();
            this.removeFromRightRound(w_pos);
        }.bind(this), this);


        // 读题
        this.node_duti.on(cc.Node.EventType.TOUCH_END, function() {
            sound_mgr.getInstance().play_effect(this.audio_ti, false);
        }.bind(this), this);
    },
    isInRightRound(pos) {
        var new_pos = this.node_listen.convertToWorldSpaceAR(cc.v2(0, 0));
        var a = new cc.Rect(new_pos.x, new_pos.y, this.node_listen.width, this.node_listen.height);
        var b = new cc.Vec2(pos.x, pos.y);
        if (this.curr_fruit && a.contains(b)) {
            this.answerNum++;
            this.taoziPool.put(this.curr_fruit);
            if (this.answerNum > 8) {
                this.answerNum--;
            } else {
                this.node_content3.addChild(cc.instantiate(this.prefab_fruits[2]));
            }
            this.curr_fruit = null;
        } else {
            if (this.curr_fruit) {
                this.taoziPool.put(this.curr_fruit);
                this.curr_fruit = null;
            }
        }
    },
    removeFromRightRound(pos){
        var new_pos = this.node_lanzi.convertToWorldSpaceAR(cc.v2(0, 0));
        var a = new cc.Rect(new_pos.x - this.node_lanzi.width / 2, new_pos.y - this.node_lanzi.height / 2, this.node_lanzi.width, this.node_lanzi.height);
        var b = new cc.Vec2(pos.x, pos.y);
        if (this.remove_fruit && a.contains(b)) {
            this.answerNum--;
            this.taoziPool.put(this.remove_fruit);

            for (var i = this.node_content3.children.length - 1; i >= 0; i--){
                if (this.node_content3.children[i].name == "chengzi"){
                    this.node_content3.removeChild(this.node_content3.children[i]);
                    break;
                }
            }
            this.remove_fruit = null;
        } else {
            if (this.remove_fruit) {
                this.taoziPool.put(this.remove_fruit);
                this.remove_fruit = null;
            }
        }
    },
    // 提交答案
    submitAnswer() {
        if (this.is_over) {
            return;
        }
        this.is_over = true;

        var res = scene_mgr.getInstance().submitAnswer(this.title_index, this.answerNum);
        if (res === 0) {
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

    },

    // update (dt) {},
});