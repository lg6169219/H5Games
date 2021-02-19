var TouchStatus = cc.Enum({
    BEGEN:  -1, // 按下
    ENDED:  -1, // 结束
    CANCEL: -1  // 取消
});

var BallStatus = cc.Enum({
    FLY:  -1, // 飞
    DOWN: -1, // 落
    NONE: -1  // 静止
});

cc.Class({
    extends: cc.Component,

    properties: {
        emitSpeed: 0,   // 发射速度
        gravity: 0,     // 重力速度
        scale: 0,       // 缩放系数
        showTime: 0,    // 生成篮球显示动画时间
        maxXSpeed: 0,   // 球弹力
    },

    init: function(game, percent){
        this.game = game;
        // this.registerInput();
        this.valid = false;
        this.status = TouchStatus.CANCEL;
        this.currentHorSpeed = 0;
        this.currentVerSpeed = 0;
        this.target =  cc.v2(0, 0);
        this.node.setScale(1);
        this.node.rotation = 0;
        this.hitIn = false;
        
        this.status = TouchStatus.ENDED;
        this.emitSpeed = 980 ;
        this.maxXSpeed = 500 ;
        this.gravity = 1430;
        //2700  500  5500  740
        // 980 500 1430 370
        // percent = 1;

        percent = Math.max(0.3, percent);

        if (percent >= 0.53 && percent <= 0.7){
            percent = 0.65;
        }
        this.currentVerSpeed = this.emitSpeed;
        this.currentHorSpeed = 554 * percent;

        this.game.soundMng.playFlySound();
    },

    // 篮球动画
    doAnim: function(){
        var scaleAnim = cc.scaleTo(1, this.scale);
        var rotateValue = (Math.random() - 0.5) * 2;
        var rotateAnim = cc.rotateBy(2, 3*360*rotateValue);
        var anim = cc.spawn(scaleAnim,rotateAnim);
        this.node.runAction(anim);
    },

    update: function (dt) {
        if(this.status != TouchStatus.ENDED){
            return;
        }

        this._updatePosition(dt);
        this._checkValid();
    },
    
    _checkValid: function(){
        if(this.ballStatus !== BallStatus.DOWN || this.valid){
            return;
        }
        
        var parent = this.node.parent;
        if(parent != null){
            var basket = this.game.basket;
            var left = basket.left;
            var right = basket.right;
            var ballRadius = this.node.getBoundingBoxToWorld().width/2;
            
            /** 统一转换成世界坐标计算进球逻辑 */
            // 篮球的边界和中心
            var ballLeft = parent.convertToWorldSpaceAR(this.node.getPosition()).x - ballRadius;
            var ballRight = parent.convertToWorldSpaceAR(this.node.getPosition()).x + ballRadius;
            var ballX = parent.convertToWorldSpaceAR(this.node.getPosition()).x;
            var ballY = parent.convertToWorldSpaceAR(this.node.getPosition()).y;
            
            // 有效进球范围
            var validTop = parent.convertToWorldSpaceAR(basket.linePreNode.getPosition()).y - ballRadius;
            var validLeft = basket.node.convertToWorldSpaceAR(left.getPosition()).x;
            var validRight = basket.node.convertToWorldSpaceAR(right.getPosition()).x;
            var validBot = basket.node.convertToWorldSpaceAR(left.getPosition()).y - ballRadius * 2;
            // console.log("============111", this.hitIn, ballY, validTop, validBot);
            // console.log("============222", this.hitIn, ballX, validLeft, validRight);
            if(ballY < validTop && ballY > validBot && ballX > validLeft && ballX < validRight){
                this.valid = true;

                // this.node.x = 130;
                // this.node.y = 164;

                this.currentHorSpeed = 0;
                this.game.score.addScore();

                this.game.player.playWin();

                // 进一个球获得一次投篮机会
                var globalVar = require('./global_var/GlobalVar');
                globalVar.lifeCount += 1;
                this.game.lifeCount.setCount(globalVar.lifeCount);

                this.game.timeMng.addTime(5);

                this.game.basket.playNetAnim();
                this.game.playBallInpfx();
                // hitIn 打框进球
                this.game.soundMng.playBallInSound();
            }
        }
    },

    // 篮球绑定自己的影子
    bindShadow: function(shadow){
        this.shadow = shadow;
    },

    // 更新篮球位置
    _updatePosition: function(dt){
        if(this.valid){

        }else{
            this.node.x += dt * this.currentHorSpeed;
        }
        // this.node.x += dt * this.currentHorSpeed;

        this.currentVerSpeed -= dt * this.gravity;

        this.node.y += dt * this.currentVerSpeed;
        
        this._changeBallStatus(this.currentVerSpeed);

        if(this.ballStatus === BallStatus.NONE && this._isOutScreen()){
            if(!this.valid){ // 没进球将分数重置
                this.game.soundMng.playBallBotInSound();
                this.game.player.enterIdleState();
            }
            
            this.node.stopAllActions();
            this.node.removeFromParent();
            this.valid = false;

            this.game.ballPool.put(this.node);
            return;
        }
    },
    
    _isOutScreen: function(){
        return this.node.y < -500;
    },

    // 更改篮球状态
    _changeBallStatus: function(speed){
        if(speed === 0 || this._isOutScreen()){
            this.ballStatus = BallStatus.NONE;
        } else if(speed > 0) {
            this.ballStatus = BallStatus.FLY;
            this.game.basket.switchMaskLineShow(false);
        } else {
            this.ballStatus = BallStatus.DOWN;
            this.game.basket.switchMaskLineShow(true);
        }
    },

    onCollisionEnter: function (other, self) {
        if(this.ballStatus === BallStatus.FLY){ // 篮球上升过程中不进行碰撞检测
            return;
        }
        if (this.valid){
            return;
        }
        var box = other.node.getComponent('CollisionBox');
        var left = box.getLeft();
        var right = box.getRight();

        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;
        var radius = world.radius;

        // 换算物体世界坐标系坐标
        var selfWorldPot = this.node.parent.convertToWorldSpaceAR(self.node.getPosition());
        var otherWorldPot = this.game.basket.node.convertToWorldSpaceAR(other.node.getPosition());

        // 将碰撞范围抽象成篮筐左右两个点，并将这两点与篮球放到同一个碰撞组。
        // 篮球中心点到刚体中心点距离除以篮球半径得到一个比值，横纵向乘以这个比值得到横纵向速度。
        var ratioVer = (selfWorldPot.y - otherWorldPot.y) / radius;
        var ratioHor = Math.abs(otherWorldPot.x - selfWorldPot.x) / radius;
        // 水平方向碰撞最大初速度
        var horV = this.currentHorSpeed / Math.abs(this.currentHorSpeed) * this.maxXSpeed;

        // 篮球碰到篮筐内，改变篮球横向速度为反方向
        // console.log("==============rrrr", other.node.name, this.node.x, left, right);
        if ((other.node.name === 'right' && this.node.x <= left) || (other.node.name === 'left' && this.node.x >= right)) {
            if (!this.hitIn) {
                this.currentHorSpeed = horV * -1 * ratioHor;
                this.hitIn = true;
            } else {
                this.currentHorSpeed = horV * ratioHor;
            }
        }

        // 篮球碰到篮筐外，增大横向速度
        if ((other.node.name === 'right' && this.node.x > right) || (other.node.name === 'left' && this.node.x < left)) {
            this.currentHorSpeed = horV;
        }
        this.currentVerSpeed = this.currentVerSpeed * -1 * ratioVer;
    },
});