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
        // 左天平
        node_tianping1: {
            default: null,
            type: cc.Node
        },
        node_tianping1_left: {
            default: null,
            type: cc.Node
        },
        node_tianping1_right: {
            default: null,
            type: cc.Node
        },
        // 右天平
        node_tianping2: {
            default: null,
            type: cc.Node
        },
        node_tianping2_left: {
            default: null,
            type: cc.Node
        },
        node_tianping2_right: {
            default: null,
            type: cc.Node
        },

        prefab_bottle1: {
            default: null,
            type: cc.Prefab
        },
        prefab_bottle2: {
            default: null,
            type: cc.Prefab
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

        title_index: 2,

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
        var list_info = global_var.list[this.title_index - 1];

        this.node_tianping1_left_operate = this.node_tianping1_left.getChildByName("node_operate");
        for (var i = 0; i < list_info.content1_left; i++) {
            this.node_tianping1_left_operate.addChild(cc.instantiate(this.prefab_bottle1));
        }

        this.node_tianping1_right_operate = this.node_tianping1_right.getChildByName("node_operate");
        for (var i = 0; i < list_info.content1_right; i++) {
            this.node_tianping1_right_operate.addChild(cc.instantiate(this.prefab_bottle2));
        }

        this.node_tianping2_left_operate = this.node_tianping2_left.getChildByName("node_operate");
        for (var i = 0; i < list_info.content2_left; i++) {
            this.node_tianping2_left_operate.addChild(cc.instantiate(this.prefab_bottle2));
        }

        this.node_tianping2_right_operate = this.node_tianping2_right.getChildByName("node_operate");

        // 左天平
        var actionBy1 = cc.rotateTo(1, -1);
        var actionBy2 = cc.rotateTo(1, 1);
        var seq = cc.sequence(actionBy1, actionBy2);
        this.node_tianping1.runAction(cc.repeatForever(seq));

        var actionBy1 = cc.rotateTo(1, 1);
        actionBy1.easing(cc.easeInOut(3.0));
        var actionBy2 = cc.rotateTo(1, -1);
        actionBy2.easing(cc.easeInOut(3.0));
        var seq = cc.sequence(actionBy1, actionBy2);
        this.node_tianping1_left.runAction(cc.repeatForever(seq));

        var actionBy1 = cc.rotateTo(1, 1);
        var actionBy2 = cc.rotateTo(1, -1);
        var seq = cc.sequence(actionBy1, actionBy2);
        this.node_tianping1_right.runAction(cc.repeatForever(seq));

        // 右天平 初始在静止状态
        var actionBy1 = cc.rotateTo(0, 20);
        this.node_tianping2.runAction(actionBy1);
        var actionBy1 = cc.rotateTo(0, -20);
        this.node_tianping2_left.runAction(actionBy1);
        var actionBy2 = cc.rotateTo(0, -20);
        this.node_tianping2_right.runAction(actionBy2);

        // 读题
        this.node_duti.on(cc.Node.EventType.TOUCH_END, function() {
            sound_mgr.getInstance().play_effect(this.audio_ti, false);
        }.bind(this), this);
    },

    start() {
        this.answerNum = 0;
        this.bottle1Pool = new cc.NodePool('bottle1');

        // 篮子 缓冲池？
        var actionBy1 = cc.rotateTo(0.5, -1);
        var actionBy2 = cc.rotateTo(0.5, 1);
        var seq = cc.sequence(actionBy1, actionBy2);
        this.node_lanzi.runAction(cc.repeatForever(seq));

        this.curr_fruit = null;
        this.remove_fruit = null;
        this.node_lanzi.on(cc.Node.EventType.TOUCH_START, function(e) {
            if (this.curr_fruit)
                return;

            var w_pos = e.getLocation();
            var pos = this.node.convertToNodeSpaceAR(w_pos);
            this.curr_fruit = this.bottle1Pool.get();
            if (!this.curr_fruit) {
                this.curr_fruit = cc.instantiate(this.prefab_bottle1);
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
            this.bottle1Pool.put(this.curr_fruit);
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
            this.remove_fruit = this.bottle1Pool.get();
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
            this.bottle1Pool.put(this.remove_fruit);
            this.remove_fruit = null;
        }.bind(this), this);

        this.node_listen.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
            if (!this.remove_fruit)
                return;
            var w_pos = e.getLocation();
            this.removeFromRightRound(w_pos);
        }.bind(this), this);

        this.btn_tijiao.on(cc.Node.EventType.TOUCH_START, function(e) {
            this.submitAnswer()
        }.bind(this), this);
    },
    isInRightRound(pos) {
        var new_pos = this.node_listen.convertToWorldSpaceAR(cc.v2(0, 0));
        var a = new cc.Rect(new_pos.x, new_pos.y, this.node_listen.width, this.node_listen.height);
        var b = new cc.Vec2(pos.x, pos.y);

        if (this.curr_fruit && a.contains(b)) {
            this.answerNum++;
            this.bottle1Pool.put(this.curr_fruit);
            if (this.answerNum > 8) {
                this.answerNum--;
            } else {
                this.node_tianping2_right_operate.addChild(cc.instantiate(this.prefab_bottle1));
            }
            this.curr_fruit = null;
        } else {
            if (this.curr_fruit) {
                this.bottle1Pool.put(this.curr_fruit);
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
            this.bottle1Pool.put(this.remove_fruit);

            for (var i = this.node_tianping2_right_operate.children.length - 1; i >= 0; i--){
                if (this.node_tianping2_right_operate.children[i].name == "bottle1"){
                    this.node_tianping2_right_operate.removeChild(this.node_tianping2_right_operate.children[i]);
                    break;
                }
            }
            this.remove_fruit = null;
        } else {
            if (this.remove_fruit) {
                this.bottle1Pool.put(this.remove_fruit);
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

        this.playTianpingAnima(res);

        var callBack = function() {
            if (res === 0) {
                this.node_win.active = true;

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
        }.bind(this);
        this.scheduleOnce(callBack, 1);
    },
    // 天平动画
    playTianpingAnima(state) {
        // -1 左重右轻 动画 保持现状抖动一下
        // 0 左右相等  动画 旋转20度 然后天平维持平衡
        // 1 左轻右重 动画 旋转40度
        if (state === -1) {
            var seq = cc.sequence(cc.rotateBy(0.1, 3), cc.rotateBy(0.1, -3));
            this.node_tianping2.runAction(cc.repeat(seq, 2));

            var seq_left = cc.sequence(cc.rotateBy(0.1, -3), cc.rotateBy(0.1, 3));
            this.node_tianping2_left.runAction(cc.repeat(seq_left, 2));
            var seq_right = cc.sequence(cc.rotateBy(0.1, -3), cc.rotateBy(0.1, 3));
            this.node_tianping2_right.runAction(cc.repeat(seq_right, 2));
        } else if (state === 0) {
            var actionBy1 = cc.rotateTo(0.5, 0);
            this.node_tianping2.runAction(actionBy1);
            var actionBy1 = cc.rotateTo(0.5, 0);
            this.node_tianping2_left.runAction(actionBy1);
            var actionBy2 = cc.rotateTo(0.5, 0);
            this.node_tianping2_right.runAction(actionBy2);

            var callBack = function() {
                var actionBy1 = cc.rotateTo(1, -1);
                var actionBy2 = cc.rotateTo(1, 1);
                var seq = cc.sequence(actionBy1, actionBy2);
                this.node_tianping2.runAction(cc.repeatForever(seq));

                var actionBy1 = cc.rotateTo(1, 1);
                actionBy1.easing(cc.easeInOut(3.0));
                var actionBy2 = cc.rotateTo(1, -1);
                actionBy2.easing(cc.easeInOut(3.0));
                var seq = cc.sequence(actionBy1, actionBy2);
                this.node_tianping2_left.runAction(cc.repeatForever(seq));

                var actionBy1 = cc.rotateTo(1, 1);
                var actionBy2 = cc.rotateTo(1, -1);
                var seq = cc.sequence(actionBy1, actionBy2);
                this.node_tianping2_right.runAction(cc.repeatForever(seq));
            };
            this.scheduleOnce(callBack, 0.5);
        } else if (state === 1) {
            var actionBy1 = cc.rotateTo(0.5, -20);
            this.node_tianping2.runAction(actionBy1);
            var actionBy1 = cc.rotateTo(0.5, 20);
            this.node_tianping2_left.runAction(actionBy1);
            var actionBy2 = cc.rotateTo(0.5, 20);
            this.node_tianping2_right.runAction(actionBy2);
        }
    },
    // 下一题
    gotoNextTitle() {
        scene_mgr.getInstance().gotoNextTitle();
    },
    // update (dt) {},
});