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
cc.Class({
    extends: cc.Component,

    properties: {
        node_start: {
            default: null,
            type: cc.Node
        },
        audio_bg: {
            default: null,
            type: cc.AudioClip
        },
        audio_click: {
            default: null,
            type: cc.AudioClip
        },      
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node_start.on(cc.Node.EventType.TOUCH_START, function() {
            scene_mgr.getInstance().gotoNextTitle();
        }.bind(this), this);
    },

    start() {
        sound_mgr.getInstance().play_music(this.audio_bg, true);
        scene_mgr.getInstance().set_click_effect(this.audio_click);
    },
    // update (dt) {},
});