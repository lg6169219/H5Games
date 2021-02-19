// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pressedScale : 0.8,
        transDuration : 0.1,
        hoverScale : 1.1,
        initScale : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initScale = this.node.scale;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchUp, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMouseEnter, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchUp, this);

        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onTouchUp, this);
    },

    onTouchDown :function(event) {
        let scaleDownAction = cc.scaleTo(this.transDuration, this.pressedScale);
        this.node.runAction(scaleDownAction);
    },

    onTouchUp : function(event) {
        let scaleUpAction = cc.scaleTo(this.transDuration, this.initScale);
        this.node.runAction(scaleUpAction);
    },

    onMouseEnter : function(event){
        var action = cc.sequence(cc.scaleTo(this.transDuration, this.hoverScale), cc.scaleTo(this.transDuration, this.initScale));
        this.node.runAction(action);
    },
    onMouseLeave : function(event){
    },
});
