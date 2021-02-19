cc.Class({
    extends: cc.Component,

    properties: {
        toggleAudio: true,
        
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        
        ballInAudio: {
            default: null,
            type: cc.AudioClip
        },
        
        ballNotInAudio: {
            default: null,
            type: cc.AudioClip
        },
        
        flyAudio: {
            default: null,
            type: cc.AudioClip
        },
                
        endAudio: {
            default: null,
            type: cc.AudioClip
        },
        bgSound: {
            default: null,
            type: cc.AudioClip
        },
    },

    onLoad: function () {
        cc.audioEngine.setEffectsVolume(0.5);
    },
    
    // 播放得分音效
    playScoreSound: function () {
        this.playSound(this.scoreAudio);
    },
    
    // 播放直接进球音效
    playBallInSound: function () {
        this.playSound(this.ballInAudio);
    },

    // 播放直接进球音效
    playBallBotInSound: function () {
        this.playSound(this.ballNotInAudio);
    },

    // 播放投掷音效
    playFlySound: function () {
        this.playSound(this.flyAudio);
    },
    
    // 播放结束音效
    playEndSound: function () {
        this.playSound(this.endAudio);
    },

    // 播放音效(不循环)
    playSound: function (sound) {
        if(this.toggleAudio){
            cc.audioEngine.playEffect(sound, false);
        }
    },

    // 播放背景
    playBgSound: function () {
        cc.audioEngine.setMusicVolume(0.3);
        cc.audioEngine.playMusic(this.bgSound, true);
    },
    stopBgSound: function () {
        cc.audioEngine.stopMusic();
    },
});
