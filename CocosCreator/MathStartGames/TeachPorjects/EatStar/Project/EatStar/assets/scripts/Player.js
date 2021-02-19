cc.Class({
    extends: cc.Component,

    properties: {
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 辅助形变动作时间
        squashDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        // 跳跃音效资源
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // use this for initialization
    onLoad: function() {
        this.enabled = false;
        // 加速度方向开关
        this.currTarget = "left";
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
        this.isJumping = false;
        // screen boundaries
        this.minPosX = -this.node.parent.width / 2;
        this.maxPosX = this.node.parent.width / 2;


        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on('touchend', this.onTouchEnd, this);
    },

    onDestroy() {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off('touchend', this.onTouchEnd, this);
    },
    changeAnimaTarget: function(isRecover) {
        if (this.isJumping) {
            return;
        }

        if (!(isRecover || (this.tempTarget != this.currTarget))) {
            return;
        }

        var animaLeftJumpNode = this.node.getChildByName("animaLeftJump");
        animaLeftJumpNode.active = false;

        var animaLeftWalkNode = this.node.getChildByName("animaLeftWalk");
        var animaLeftWalk = animaLeftWalkNode.getComponent("frame_anima");

        animaLeftWalkNode.active = true;
        animaLeftWalk.play_loop();

        this.tempTarget = this.currTarget;
    },
    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.currTarget = "left";
                this.node.scaleX = Math.abs(this.node.scaleX) * 1;
                // this.changeAnimaTarget();
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.currTarget = "right";
                this.node.scaleX = Math.abs(this.node.scaleX) * -1;
                // this.changeAnimaTarget();
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                if (!this.isJumping) {
                    this.node.runAction(this.setJumpAction());
                }
                break;
        }
    },
    onTouchEnd(event) {
        var touchLoc = event.getLocation();
        var preLoc = event.getStartLocation();
        if (touchLoc.y > preLoc.y) {
            if (!this.isJumping) {
                this.node.runAction(this.setJumpAction());
            }
        } else {
            if (touchLoc.x >= cc.winSize.width / 2) {
                this.currTarget = "right";
                this.node.scaleX = Math.abs(this.node.scaleX) * -1;
                // this.changeAnimaTarget();
            } else {
                this.currTarget = "left";
                this.node.scaleX = Math.abs(this.node.scaleX) * 1;
                // this.changeAnimaTarget();
            }
        }
    },

    setJumpAction: function() {
        this.isJumping = true;

        var animaLeftWalkNode = this.node.getChildByName("animaLeftWalk");
        var animaLeftWalk = animaLeftWalkNode.getComponent("frame_anima");

        var animaLeftJumpNode = this.node.getChildByName("animaLeftJump");
        var animaLeftJump = animaLeftJumpNode.getComponent("frame_anima");

        // 跳跃动画
        var jumpFunc = cc.callFunc(function() {
            animaLeftWalkNode.active = false;
            animaLeftJumpNode.active = true;
            animaLeftJump.play_once();

        }.bind(this), this);

        var delay1 = cc.delayTime(0.1);
        var delay2 = cc.delayTime(0.1);
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());

        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 恢复走的动画
        var walkFunc = cc.callFunc(function() {
            this.changeAnimaTarget(true);
        }.bind(this), this);
        return cc.sequence(jumpFunc, delay1, jumpUp, jumpDown, callback, delay2, walkFunc);
        // return cc.repeatForever(cc.sequence(jumpFunc, delay1, jumpUp, jumpDown, callback, delay2));
    },

    playJumpSound: function() {
        this.isJumping = false;
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    getCenterPos: function() {
        var centerPos = cc.v2(this.node.x, this.node.y + this.node.height / 2);
        return centerPos;
    },

    startMoveAt: function(pos) {
        this.changePlayerSize(0);
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        this.changeSize = false;

        this.changeAnimaTarget();
    },

    stopMove: function() {
        this.node.stopAllActions();
    },

    // called every frame
    update: function(dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.currTarget === "left") {
            this.xSpeed = -(this.jumpXSpeed || 150);
        } else {
            this.xSpeed = this.jumpXSpeed || 150;
        }
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;

        // limit player position inside screen
        if (this.node.x > this.node.parent.width / 2) {
            this.node.x = -this.node.parent.width / 2;
            // this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width / 2) {
            this.node.x = this.node.parent.width / 2;
            // this.xSpeed = 0;
        }
    },
    // 根据分数改变体型和跳跃高度
    changePlayerSize(score) {
        var globalVar = require("GlobalVar");
        var playerSizeList = globalVar.playerSizeList[score];
        if (playerSizeList) {
            this.node.scale = playerSizeList.scale;
            if (this.currTarget === "left") {
                this.node.scaleX = Math.abs(this.node.scaleX) * 1;
            } else {
                this.node.scaleX = Math.abs(this.node.scaleX) * -1;
            }
            this.jumpHeight = playerSizeList.jumpHeight;
            this.jumpXSpeed = playerSizeList.xSpeed;
            if (score > 0) {
                this.changeSize = true;
            }
        }
    },
});