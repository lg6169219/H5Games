// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        touchSlider: {
            type : cc.Slider,
            default : null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.beginTouch = false;
        this.power = 0;
        this.maxPower = 2;
    },
    init: function(game){
        this.game = game;

        var shootNode = this.node.getChildByName("shoot");
        var shootComp = shootNode.getComponent("frame_anima");

        this.node.on(cc.Node.EventType.TOUCH_START, function(){
            var idleNode = this.node.getChildByName("idle");
            if(!shootComp.is_playing && idleNode.active){
                this.beginTouch = true;
                this.power = 0;
            }
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function(){
            this.shoot();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(){
            this.shoot();
        }, this);

        this.enterIdleState();
    },
    start () {
    },
    shoot : function(){
        if(this.beginTouch){
            this.beginTouch = false;           
        }
        else{
            return;
        }

        // 退出idle状态
        this.quitIdleState();

        var shootNode = this.node.getChildByName("shoot");
        var shootComp = shootNode.getComponent("frame_anima");

        if (shootComp.is_playing){
            return;
        }

        shootComp.play_once(function(){
            // this.scheduleOnce(function(){
            //     // shootComp.resetAnima();
            //     this.enterIdleState();
            // }.bind(this), 1);
        }.bind(this));

        this.scheduleOnce(function(){
            this.game.shootBall(parseFloat(this.touchSlider.progress));
        }.bind(this), shootComp.duration * 4 + 0.1);
    },

    // 进入idle状态 循环播放动画
    enterIdleState : function(){
        var idleNode = this.node.getChildByName("idle");
        idleNode.active = true;

        var shootNode = this.node.getChildByName("shoot");
        shootNode.active = false;

        var winNode = this.node.getChildByName("win");
        winNode.active = false;

        this.playIdle();

        this.schedule(this.playIdle, 0.7);
    },
    quitIdleState : function(){
        var idleNode = this.node.getChildByName("idle");
        idleNode.active = false;

        var shootNode = this.node.getChildByName("shoot");
        shootNode.active = true;

        var winNode = this.node.getChildByName("win");
        winNode.active = false;

        this.unschedule(this.playIdle);
    },
    playIdle: function(){
        var idleNode = this.node.getChildByName("idle");
        var idleComp = idleNode.getComponent("frame_anima");
        idleComp.play_once();
    },
    playWin: function(){
        
        // 退出idle状态
        this.quitIdleState();

        var shootNode = this.node.getChildByName("shoot");
        shootNode.active = false;

        var winNode = this.node.getChildByName("win");
        winNode.active = true;

        var winComp = winNode.getComponent("frame_anima");
        winComp.play_once(function(){
            this.enterIdleState();
        }.bind(this));
    },
    update (dt) {
        if (this.beginTouch){
            this.power += dt * 4;
            if(this.power > this.maxPower){
                this.power = 0;
            }
            this.power = Math.min(this.power, this.maxPower);
            var per = this.power / this.maxPower;
            this.touchSlider.progress = per;
        }
    },

    resetBar: function(){
        this.touchSlider.progress = 0;
    }
});
