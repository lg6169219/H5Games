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
        initScale : 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    showButton(){
        this.globalVar = require('GlobalVar');
        var gameSoundCfg = this.globalVar.gameResConfig.game_sound;
        if (gameSoundCfg != null && gameSoundCfg.audio_bg != null){
            this.node.active = true;
            this.regButton();
        }else{
            this.node.active = false;
        }
    },

    regButton(){
        // 初始化按钮状态
        var gameSoundCfg = this.globalVar.gameResConfig.game_sound;

        var audioBgCfg = gameSoundCfg.audio_bg;

        cc.loader.loadRes(audioBgCfg.res, cc.AudioClip, function(err, audioClip){
            cc.audioEngine.playMusic(audioClip);
            cc.audioEngine.loop = audioBgCfg.loop;
            cc.audioEngine.setMusicVolume(audioBgCfg.audioVolume || 0.5);
        });
        
        this.checkBtnState();

        this.node.on('touchstart', this.onTouchDown, this);
        this.node.on('touchend', this.onTouchUp, this);
        this.node.on('touchcancel', this.onTouchUp, this);

        this.initScale = this.node.scale;
    },

    onTouchDown :function(event) {
        let scaleDownAction = cc.scaleTo(this.transDuration, this.pressedScale);
        this.node.runAction(scaleDownAction);
        
        this.globalVar.isPlayAudio = !this.globalVar.isPlayAudio;

        if(this.globalVar.isPlayAudio){
            cc.audioEngine.resumeAll();                   
        }else{
            cc.audioEngine.pauseAll();  
        }

        //这里可以添加音效
        this.checkBtnState();
    },

    onTouchUp : function(event) {
        let scaleUpAction = cc.scaleTo(this.transDuration, this.initScale);
        this.node.runAction(scaleUpAction);
        
    },

    // 按钮的状态
    checkBtnState : function(){
        var playNode = this.node.getChildByName("play");
        var stopNode = this.node.getChildByName("stop");

        if (!!this.globalVar.isPlayAudio){
            playNode.active = false;
            stopNode.active = true;
        }else{
            playNode.active = true;
            stopNode.active = false;
        }
    },
});
