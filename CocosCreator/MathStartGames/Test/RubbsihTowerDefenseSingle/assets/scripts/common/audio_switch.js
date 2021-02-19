// 音乐、音效按钮状态切换
var sound_manager = require("sound_manager");

cc.Class({
    extends: cc.Component,

    properties: {
        type: 0, // 0表示为music开关  1为音效开关
        off_spriteFrame: {
            type: cc.SpriteFrame,
            default: null
        },
        on_spriteFrame: {
            type: cc.SpriteFrame,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 获取状态图片的sprite自己
        this.sp = this.node.getComponent(cc.Sprite);

        this.node.on(cc.Node.EventType.TOUCH_START, this.on_switch_click, this);
    },

    start() {
        if (this.type === 0) {
            if (sound_manager.b_music_mute) {
                this.sp.spriteFrame = this.off_spriteFrame;
            } else {
                this.sp.spriteFrame = this.on_spriteFrame;
            }
        } else if (this.type === 1) {
            if (sound_manager.b_effect_mute) {
                this.sp.spriteFrame = this.off_spriteFrame;
            } else {
                this.sp.spriteFrame = this.on_spriteFrame;
            }
        }
    },

    on_switch_click: function() {
        var b_mute;
        if (this.type === 0) {
            b_mute = (sound_manager.b_music_mute) ? 0 : 1;
            sound_manager.set_music_mute(b_mute);
        } else if (this.type === 1) {
            b_mute = (sound_manager.b_effect_mute) ? 0 : 1;
            sound_manager.set_effect_mute(b_mute);
        }

        if (b_mute) {
            this.sp.spriteFrame = this.off_spriteFrame;
        } else {
            this.sp.spriteFrame = this.on_spriteFrame;
        }
    },
    // update (dt) {},
});