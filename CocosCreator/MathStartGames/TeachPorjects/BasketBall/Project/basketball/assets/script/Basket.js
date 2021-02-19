cc.Class({
    extends: cc.Component,

    properties: {
        line: cc.Node,
        left: cc.Node,
        right: cc.Node,
        linePre: cc.Prefab,
        count: cc.Label,
    },
    
    init: function (game) {
        this.game = game;
        this._createMaskLine();
    },

    startMove: function(){
        // this._doMoveAnim();
    },

    stopMove: function(){
        this.node.stopAllActions();
        this._resetPosition();
    },

    _resetPosition: function(){
        this.node.setPosition(0);
    },
    
    // 篮筐移动动画
    _doMoveAnim: function(){
        var moveRight = cc.moveBy(3, cc.v2(200, 0));
        var moveLeft = cc.moveBy(3, cc.v2(-200, 0));
        var repeat = cc.repeatForever(cc.sequence(moveRight, moveLeft, moveLeft, moveRight));
        this.node.runAction(repeat);
    },
    
    update: function (dt) {
        if(!this.linePreNode){
            return;
        }
        // 修改遮罩位置，先进行坐标转换        
        var worldPot = this.node.convertToWorldSpaceAR(this.line.getPosition());
        var nodePot = this.node.parent.convertToNodeSpaceAR(worldPot);
        this.linePreNode.setPosition(cc.v2(this.node.x, nodePot.y));
    },
    
    // 创建篮筐遮罩
    _createMaskLine: function(){
        this.linePreNode = cc.instantiate(this.linePre);
        this.game.node.addChild(this.linePreNode);
    },
    
    // 切换篮筐遮罩层级
    switchMaskLineShow: function(flag){
        if(flag){
            this.linePreNode.zIndex = 100;
            // this.linePreNode.setLocalZOrder(100);
        }else{
            this.linePreNode.zIndex = 0;
            // this.linePreNode.setLocalZOrder(0);
        }
    },

    // 球网动画
    playNetAnim: function(){
        if(this.linePreNode){
            var scaleLong = cc.scaleTo(0.1, 1, 1.1);
            var scaleShort = cc.scaleTo(0.3, 1, 0.9);
            var scaleNomal = cc.scaleTo(0.2, 1, 1);

            var anim = cc.sequence(scaleLong,scaleShort,scaleNomal);
            this.linePreNode.getChildByName('net').runAction(anim);
        }
    },
});
