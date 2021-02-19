"use strict";
cc._RF.push(module, 'ae9ceO5+RVE54Bbf2+IuCYV', 'frame_anima');
// scripts/anima/frame_anima.js

"use strict";

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
        // 帧动画的图片，多张图片
        sprite_frames: {
            default: [],
            type: cc.SpriteFrame
        },

        duration: 0.1, // 帧时间间隔
        loop: false, // 是否循环播放
        play_onload: false // 是否在加载时候就开始播放
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.end_func = null;
        this.is_playing = false;
        this.play_time = 0; //播放动画的时间

        this.sprite = this.node.getComponent(cc.Sprite);
        if (!this.sprite) {
            this.sprite = this.node.addComponent(cc.Sprite);
        }

        this.saveX = this.node.x;
        this.saveY = this.node.y;

        // 加载时候开始播放
        if (this.play_onload) {
            if (this.loop) {
                this.play_loop();
            } else {
                this.play_once(null);
            }
        }
    },
    stopAnima: function stopAnima() {
        // this.is_playing = false;
    },

    play_loop: function play_loop() {
        if (this.sprite_frames.length <= 0) {
            return;
        }

        this.loop = true;
        this.end_func = null;

        this.is_playing = true;
    },

    // 需要播放结束回调
    play_once: function play_once(end_func, currTime) {
        if (this.sprite_frames.length <= 0) {
            return;
        }
        this.play_time = currTime || 0;
        this.end_func = end_func;

        this.loop = false;
        this.is_playing = true;
    },

    reset_anima: function reset_anima() {
        if (this.sprite) {
            this.sprite.spriteFrame = this.sprite_frames[0];
        }
    },

    update: function update(dt) {
        if (!this.is_playing) {
            return;
        }

        this.play_time += dt;
        var index = Math.floor(this.play_time / this.duration);
        // 非循环播放
        if (!this.loop) {
            if (index >= this.sprite_frames.length) {
                // 结束了
                this.is_playing = false;
                if (this.end_func) {
                    this.end_func();
                }
            } else {
                this.sprite.spriteFrame = this.sprite_frames[index];
            }
        } else {
            while (index >= this.sprite_frames.length) {
                index -= this.sprite_frames.length;
                this.play_time -= this.sprite_frames.length * this.duration;
            }
            this.sprite.spriteFrame = this.sprite_frames[index];
        }
    },


    getCurrTime: function getCurrTime() {
        return this.play_time;
    }
});

cc._RF.pop();