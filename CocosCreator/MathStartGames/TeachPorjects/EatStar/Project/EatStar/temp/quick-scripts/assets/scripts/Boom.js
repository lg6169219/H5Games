(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Boom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dd321s7jeZJXpIaKBwwZqBe', 'Boom', __filename);
// scripts/Boom.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // 星星和主角之间的距离小于这个数值时，就会完成收集
        pickRadius: 0
    },

    onLoad: function onLoad() {
        this.enabled = false;
    },

    // use this for initialization
    init: function init(game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    },

    reuse: function reuse(game) {
        this.init(game);
    },


    getPlayerDistance: function getPlayerDistance() {
        // 根据 player 节点位置判断距离
        var playerPos = this.game.player.getCenterPos();
        // 根据两点位置计算两点之间距离
        var pos = cc.v2(this.node.x, this.node.y);
        var dist = pos.sub(playerPos).mag();
        return dist;
    },

    onPicked: function onPicked() {
        if (this.isPicked) {
            return;
        }

        var boompfx = this.node.getChildByName("boompfx");
        if (boompfx) {
            this.isPicked = true;
            // 播放爆炸音效
            cc.audioEngine.playEffect(this.game.boomAudio, false);
            cc.audioEngine.setEffectsVolume(0.4);

            this.node.getComponent(cc.Sprite).enabled = false;
            boompfx.active = true;
            var frameAnima = boompfx.getComponent("frame_anima");
            frameAnima.play_once(function () {
                boompfx.active = false;

                var pos = this.node.getPosition();
                // 调用 Game 脚本的得分方法
                this.game.gainLife(pos);
                // 当星星被收集时，调用 Game 脚本中的接口，销毁当前星星节点，生成一个新的星星
                this.game.despawnBoom();

                this.isPicked = false;
            }.bind(this));
        }
    },

    // called every frame
    update: function update(dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Boom.js.map
        