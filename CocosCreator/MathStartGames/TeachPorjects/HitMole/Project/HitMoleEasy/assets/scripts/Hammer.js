// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var frame_anima = require("frame_anima");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
        this.globalVar = require('GlobalVar');
        var gameContentCfg = this.globalVar.gameResConfig.game_content;

        var btnHammerCfg = gameContentCfg.btn_hammer;
        this.node.scaleX = btnHammerCfg.image.scaleX;
        this.node.scaleY = btnHammerCfg.image.scaleY;

        var annimaNameList = ["animate_play", "animate_stop"];
        var animaList = {};
        var self = this;
        cc.loader.loadRes(btnHammerCfg.image.atlas, cc.SpriteAtlas, function(err, spriteAtlas){
            var allSpriteFrames = spriteAtlas.getSpriteFrames();

            for(let j = 0; j < annimaNameList.length; j++){
                var key = annimaNameList[j];
                var cfg = btnHammerCfg[key];

                animaList[key] = [];
                for (let i = 0; i < allSpriteFrames.length; i++){
                    let sFrame = allSpriteFrames[i];
                    if (sFrame.name.indexOf(cfg.res) != -1){
                        animaList[key].push(sFrame);
                    }
                }
            }

            for(let j = 0; j < annimaNameList.length; j++){
                var key = annimaNameList[j];
                var cfg = btnHammerCfg[key];
                self.createAnimation(self.node, animaList[key], cfg.loop, key);
            }

            self.regEvent();
        });
    },

    createAnimation(node, frames, isLoop, name){
        var spriteNormalButton = node;
        var animation = spriteNormalButton.getComponent(cc.Animation);
        if (!animation){
            animation = spriteNormalButton.addComponent(cc.Animation);
        }
        // frames 这是一个 SpriteFrame 的数组.
        var clip = cc.AnimationClip.createWithSpriteFrames(frames, 10);
        clip.name = name;
        clip.wrapMode = isLoop ? cc.WrapMode.Loop : cc.WrapMode.Normal;
        clip.speed = 1;

        // 添加帧事件
        clip.events.push({
            frame: 2,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
            func: "frameEvent",     // 回调函数名称
            params: [1, "hello"]    // 回调参数
        });
    
        animation.addClip(clip);
    },

    regEvent(){
        var animation = this.node.getComponent(cc.Animation);
        animation.play("animate_stop");

        this.game.showHammer();
    },
    // update (dt) {},
});
