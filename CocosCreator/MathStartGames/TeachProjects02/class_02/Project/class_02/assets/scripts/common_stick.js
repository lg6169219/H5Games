// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var enum_shape_type = cc.Enum({
    SANJIAO: 0,
    ZHENGFANGXING: 1,
    PINGXINGSHIBIANXING: 2
});
var scene_mgr = require("./scene_manager");
cc.Class({
    extends: cc.Component,

    properties: {
        /**
         * 1 2上 3
         * 4 5中 6
         * 7 8下 9
         */
        lab_index: {
            type: cc.Label,
            default: null
        },
        index: 1,
        piece_type: 0, // 0 use 1 design
        shape_type: {
            type: cc.Enum(enum_shape_type),
            default: enum_shape_type.SANJIAO
        },
        scale_num: {
            type: cc.Float,
            default: 1
        },
        rotate_index: 0
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
    },
    // 播放缩放动画
    play_scale_anima: function(scale_num) {
        this.node.runAction(cc.scaleTo(0.3, scale_num));
    },
    onDisable: function() {
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_MOVE);
        this.node.off(cc.Node.EventType.TOUCH_END);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL);
    }
});