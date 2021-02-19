// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var sound_mgr = require("../sound_manager");
var gameCfg = require("GameCfg");
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
        questionLabel : { default : null, type : cc.Label },
        questionAudio : { default : null, type : cc.AudioClip },
        readQuestion : { default : null, type : cc.Node },
        rotBtn : { default : null, type : cc.Button },
		opArea: { default : null, type : cc.Node },
		prefabStickRed: { default : null, type : cc.Prefab },
        prefabStickGreen: { default : null, type : cc.Prefab },
        selectedStick: { default : null, type : cc.Node },
        nodeWin: { default : null, type : cc.Node },
		nodeLose: { default : null, type : cc.Node },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.questions = {
            tri:{
                content:"例2：为了对付犀牛上校，小伙伴又想出了新的难题：在三角形的基础上再增加2根小棍变成2个三角形，小朋友，你知道该怎么做吗？",
                createFun: gameCfg.createFun.tri,
                checkFun: gameCfg.checkFun.tri,
                ret: false,
                touchstart: this.triSelectStick,
                touchmove: this.triMoveStick,
                touchend: this.triEndStick,
                stick1right: false,
                stick1angle: 0,
                stick1index: 0,
                stick2right: false,
                stick2angle: 0,
                stick2index: 0,
                showRot: true,
                rotText: "旋转",
                rotFun: this.triRotClick,
            },
            removestick:{
                content: "练习3：下面的数字只减少1根小棍，不移动其他小棍的情况下会变成哪个新数字呢？",
                createFun: gameCfg.createFun.removestick,
                checkFun: gameCfg.checkFun.removestick,
                ret: false,
                touchstart: this.removestickSelectStick,
                touchmove: this.removestickMoveStick,
                touchend: this.removestickEndStick,
                showRot: true,
                rotText: "继续尝试",
                rotFun: this.removestickRotClick,
                group: 1,
                groupRemove: [-1],
            },
            movestick:{
                content: "练习4：只移动1根小棍，在不改变其他小棍的情况下，会变出哪些数字呢？",
                createFun: gameCfg.createFun.removestick,
                checkFun: gameCfg.checkFun.movestick,
                ret: false,
                touchstart: this.movestickSelectStick,
                touchmove: this.movestickMoveStick,
                touchend: this.movestickEndStick,
                showRot: true,
                rotText: "继续尝试",
                rotFun: this.removestickRotClick,
                group: 1,
                groupRemove: [-1],
            },
        };

        this.tindex = 0;
        this.teacher = [
            { qtype : "removestick", exts : { orgNum : 8, maxGroup : 3 } },
            { qtype : "tri" },
            { qtype : "movestick", exts : { orgNum : 0, maxGroup : 1 } },
            { qtype : "movestick", exts : { orgNum : 2, maxGroup : 1 } },
            { qtype : "movestick", exts : { orgNum : 3, maxGroup : 1 } },
            { qtype : "movestick", exts : { orgNum : 5, maxGroup : 1 } },
            { qtype : "movestick", exts : { orgNum : 6, maxGroup : 1 } },
            { qtype : "movestick", exts : { orgNum : 9, maxGroup : 1 } },
        ];
        this.createQuestion();

        // 读题
        this.readQuestion.on(cc.Node.EventType.TOUCH_END, function() {
            sound_mgr.getInstance().play_effect(this.questionAudio, false);
        }, this);

        // 绑定完成按钮事件
        this.nodeWin.getChildByName("button").on(cc.Node.EventType.TOUCH_END, this.nodeResultClick, this);
        this.nodeLose.getChildByName("button").on(cc.Node.EventType.TOUCH_END, this.nodeResultClick, this);

    },

    nodeResultClick(t){
        if(!this.isOver)
            this.createQuestion();
    },

    createQuestion() {
        this.clearStage();

        var teacher = this.teacher[this.tindex];
        var question = this.questions[teacher.qtype];
        question.ret = false;
        question.exts = teacher.exts;
        question.groupRemove = [-1];

        this.questionLabel.string = question.content;

        this.rotBtn.node.off(cc.Node.EventType.TOUCH_END);
        if(question.showRot){
            this.rotBtn.node.opacity = 255;
            this.rotBtn.node.getChildByName("btn_rot_text").getComponent(cc.Label).string = question.rotText;
            this.rotBtn.node.on(cc.Node.EventType.TOUCH_END, question.rotFun, this);
        }
        else{
            this.rotBtn.node.opacity = 0;
        }

        this.question = question;
        this.sticks = [];
        this.addSticks();

    },

    addSticks() {
        var sticks = this.question.createFun(this.prefabStickRed, this.prefabStickGreen, this.question);
        for(var i = 0; i < sticks.length; i++){
            var stick = sticks[i];
            this.opArea.addChild(stick);
            if(stick.canClick){
                stick.on(cc.Node.EventType.TOUCH_START, this.question.touchstart, this);
                stick.on(cc.Node.EventType.TOUCH_MOVE, this.question.touchmove, this);
                stick.on(cc.Node.EventType.TOUCH_END, this.question.touchend, this);
            }
            this.sticks.push(stick);
        }
    },

    clearStage() {
        this.questionLabel.string = "";
        if(this.sticks != null){
            for(var i = 0; i < this.sticks.length; i++){
                var stick = this.sticks[i];
                stick.targetOff(stick);
            }
            this.opArea.destroyAllChildren();
            this.sticks = [];
            this.sticks = null;
        }
        this.nodeWin.active = false;
        this.nodeLose.active = false;
    },

    // tri funcs
    triSelectStick(t){
        this.selectedStick = t.target;
        cc.log( "x:" + this.selectedStick.x + ", y:" + this.selectedStick.y + ", angle:" + this.selectedStick.angle );
    },
    triMoveStick(t){
        if(this.selectedStick != null){
            var delta = t.getDelta();
            this.selectedStick.x += delta.x;
            this.selectedStick.y += delta.y;

            this.question.checkFun(this.question, this.selectedStick);
        }
    },
    triEndStick(t){},
    triRotClick: function (event, customEventData) {
        if(this.selectedStick != null){
            this.selectedStick.angle += 30;
            this.selectedStick.angle = this.selectedStick.angle % 360;
            // cc.log( "x:" + this.selectedStick.x + ", y:" + this.selectedStick.y + ", angle:" + this.selectedStick.angle );

            this.question.checkFun(this.question, this.selectedStick);
        }
    },

    // remove stick funs
    removestickSelectStick(t){
        this.selectedStick = t.target;
        for(var i = 0; i < this.sticks.length; i++){
            var stick = this.sticks[i];
            if(stick.sgroup == this.selectedStick.sgroup){
                stick.active = true;
            }
        }
        this.selectedStick.active = false;
        this.question.checkFun(this.question, this.selectedStick);
    },
    removestickMoveStick(t){},
    removestickEndStick(t){},
    removestickRotClick: function(event, customEventData){
        this.question.groupRemove[this.question.group] = -1;
        this.question.group++;
        this.addSticks();
        if(this.question.group >= this.question.exts.maxGroup){
            cc.log("maxGroup");
            this.rotBtn.node.opacity = 0;
            this.rotBtn.node.off(cc.Node.EventType.TOUCH_END);
        }
    },

    // move stick funs
    movestickSelectStick(t){
        this.selectedStick = t.target;
        this.selectedStick.orgx = this.selectedStick.x;
        this.selectedStick.orgy = this.selectedStick.y;
    },
    movestickMoveStick(t){
        if(this.selectedStick != null){
            var delta = t.getDelta();
            this.selectedStick.x += delta.x;
            this.selectedStick.y += delta.y;

        }
    },
    movestickEndStick(t){
        this.question.checkFun(this.question, this.selectedStick, this.sticks);
        this.selectedStick = null;
    },

    commitClick: function(event, customEventData) {
        if(this.sticks == null){
            return;
        }
        var ret = this.question.ret;
        cc.log("result: " + ret);

        var node = ret ? this.nodeWin : this.nodeLose;
        node.active = true;
        var audio = node.getComponent(cc.AudioSource);
        audio.play();
        node.scale = 0;
        var s = cc.scaleTo(0.4, 1).easing(cc.easeBackOut());
        node.runAction(s);

        var node_btn = node.getChildByName("button");
        this.tindex++;
        this.isOver = this.tindex >= this.teacher.length;
        node_btn.getChildByName("Label").getComponent(cc.Label).string =  this.isOver ? "提交" : "下一题";
    },

    // update (dt) {},
});
