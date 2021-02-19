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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        type : 1,
        currBeatTarget : null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.globalVar = require("GlobalVar");
        
        var spriteNormalButton = this.node.getChildByName("SpriteNormalButton");
        spriteNormalButton.active = false;

        var spriteHitButton = this.node.getChildByName("SpriteHitButton");
        spriteHitButton.active = false;

        this.downY = -120;
        this.upY = spriteNormalButton.y;

        spriteNormalButton.on(cc.Node.EventType.TOUCH_START, this.hit, this);
        spriteNormalButton.on(cc.Node.EventType.TOUCH_MOVE, this.onTap, this);
    },
    loadRes(){
        var dishuContentCfg = this.globalVar.gameResConfig.game_content.dishu_content;
        var dishuCfg = dishuContentCfg["btn_dishu" + this.type];
        var spriteNormalButton = this.node.getChildByName("SpriteNormalButton");
        var spriteNormal = spriteNormalButton.getComponent(cc.Sprite);

        var annimaNameList = ["animate_play", "animate_stop"];

        var animaList = {};
        var self = this;
        cc.loader.loadRes(dishuCfg.image.atlas, cc.SpriteAtlas, function(err, spriteAtlas){
            spriteNormal.spriteAtlas = spriteAtlas;
            var allSpriteFrames = spriteAtlas.getSpriteFrames();

            for(let j = 0; j < annimaNameList.length; j++){
                var key = annimaNameList[j];
                var cfg = dishuCfg[key];

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
                var cfg = dishuCfg[key];

                self.createAnimation(spriteNormalButton, animaList[key], cfg.loop, key);
            }

            self.show();
        });


        // 被击特效
        var gameContentCfg = this.globalVar.gameResConfig.game_content;
        var btnHammerCfg = gameContentCfg.btn_molepfx;
        var annimaNameList2 = ["animate_play"];
        var spriteHitButton = this.node.getChildByName("SpriteHitButton");
        
        var animaList2 = {};
        cc.loader.loadRes(btnHammerCfg.image.atlas, cc.SpriteAtlas, function(err, spriteAtlas){
            var allSpriteFrames = spriteAtlas.getSpriteFrames();

            for(let j = 0; j < annimaNameList2.length; j++){
                var key = annimaNameList2[j];
                var cfg = btnHammerCfg[key];

                animaList2[key] = [];
                for (let i = 0; i < allSpriteFrames.length; i++){
                    let sFrame = allSpriteFrames[i];
                    if (sFrame.name.indexOf(cfg.res) != -1){
                        animaList2[key].push(sFrame);
                    }
                }
            }

            for(let j = 0; j < annimaNameList2.length; j++){
                var key = annimaNameList2[j];
                var cfg = btnHammerCfg[key];
                self.createAnimation(spriteHitButton, animaList2[key], cfg.loop, key);
            }
        });
    },
    createAnimation(node, frames, isLoop, name){
        var spriteNormalButton = node;
        var animation = spriteNormalButton.getComponent(cc.Animation);
        if(animation != null){
            // frames 这是一个 SpriteFrame 的数组.
            var clip = cc.AnimationClip.createWithSpriteFrames(frames, 10);
            clip.name = name;
            clip.wrapMode = isLoop ? cc.WrapMode.Loop : cc.WrapMode.Normal;
        
            // 添加帧事件
            clip.events.push({
                frame: 1,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
                func: "frameEvent",     // 回调函数名称
                params: [1, "hello"]    // 回调参数
            });
        
            animation.addClip(clip);
        }
    },
    show(){
        if(this.isActive) return;
        this.isActive = true;
        this.isShow = true;

        var spriteNormalButton = this.node.getChildByName("SpriteNormalButton");
        spriteNormalButton.active = true;
        
        var animation = spriteNormalButton.getComponent(cc.Animation);
        if(animation != null){
            animation.play("animate_stop");
        }

        spriteNormalButton.y = this.downY;

        var hideTime = 0.5;
        var delayTime = 0.6;
        var showTime = 0.4;
        if (this.game.isChangeGameSpeed){
            hideTime = 0.3;
            delayTime = 0.3;
            showTime = 0.3;      
        }
        //消失
        this.hide = cc.callFunc(function(target){
            if(this.isShow && !this.isHit){
                this.isShow = false;
                let seq = cc.sequence(cc.moveTo(hideTime, 0, this.downY), resetFunc);
                spriteNormalButton.runAction(seq);
            } 
        }, this);

        // 停留
        this.showComplete = cc.callFunc(function(target) {
            if(this.isShow && !this.isHit){
                let seq = cc.sequence(cc.delayTime(delayTime), this.hide);
                spriteNormalButton.runAction(seq);
            }
        }, this);

        // 重置
        var resetFunc = cc.callFunc(function(target){
            this.reset();
        }, this);

        var seq = cc.sequence(cc.moveTo(showTime, spriteNormalButton.x, this.upY), this.showComplete);
        spriteNormalButton.runAction(seq);
    },
    //触摸到 string key 为什么这么干，是因为有时候鼠标已经放上去了，但是这时候目标刷新了，就失败了，体验很差，所以做了个上次tap的判断
    onTap : function(){
    },

    hit(e){
        if(this.isShow && !this.isHit){
            this.isHit = true;
            this.isShow = false;

            var spriteNormalButton = this.node.getChildByName("SpriteNormalButton");
            spriteNormalButton.stopAllActions();

            var animationNormal = spriteNormalButton.getComponent(cc.Animation);
            if(animationNormal != null){
                animationNormal.play("animate_play");
            }

            // 被击效果
            var spriteHitButton = this.node.getChildByName("SpriteHitButton");
            var animation = spriteHitButton.getComponent(cc.Animation);
            if(animation != null){
                spriteHitButton.active = true;
                animation.play("animate_play");
            }

            this.scheduleOnce(this.reset, 0.5);

            // 音效
            if ((this.game.beatTarget && this.game.beatTarget.type == this.type) || (this.game.lastBeatType === this.type)){
                cc.audioEngine.setEffectsVolume(this.globalVar.gameResConfig.game_sound.audio_success.audioVolume);

                cc.loader.loadRes(this.globalVar.gameResConfig.game_sound.audio_success.res, cc.AudioClip, function(err, audioClip){
                    cc.audioEngine.playEffect(audioClip);
                });
                this.game.lastBeatType = 0;
                this.game.updateLabelResult(true);
            }else{
                this.globalVar.hammerNum -= 1;
                this.game.showNumLabel(this.globalVar.hammerNum);

                cc.audioEngine.setEffectsVolume(this.globalVar.gameResConfig.game_sound.audio_error.audioVolume);

                cc.loader.loadRes(this.globalVar.gameResConfig.game_sound.audio_error.res, cc.AudioClip, function(err, audioClip){
                    cc.audioEngine.playEffect(audioClip);
                });

                this.game.updateLabelResult(false);
            }

            if (cc.sys.isMobile){
                this.game.hammerMobileAnima(e);
            }else{
                this.game.hammerPCAnima();
            }
        }
    },
    reset(){
        var spriteNormalButton = this.node.getChildByName("SpriteNormalButton");
        spriteNormalButton.active = false;

        var spriteHitButton = this.node.getChildByName("SpriteHitButton");
        spriteHitButton.active = false;

        this.isActive = false;
        this.isShow = false;
        this.isHit = false;
    },
    // update (dt) {},
});
