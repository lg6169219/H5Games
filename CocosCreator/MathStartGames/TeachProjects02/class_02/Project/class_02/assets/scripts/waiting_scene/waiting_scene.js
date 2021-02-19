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
        node_rotate01: {
            type: cc.Node,
            default: null
        },
        node_rotate02: {
            type: cc.Node,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        var repet1 = cc.repeatForever(cc.rotateBy(15, 360));
        var repet2 = cc.repeatForever(cc.rotateBy(8, -360));
        this.node_rotate01.runAction(repet1);
        this.node_rotate02.runAction(repet2);
    },

    // update (dt) {},
    onDestroy() {
        this.node_rotate01.stopAllActions();
        this.node_rotate02.stopAllActions();
    },
});