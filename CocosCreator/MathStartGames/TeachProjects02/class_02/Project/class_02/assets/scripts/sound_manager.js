// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var sound_manager = cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    set_music_volume() {
        cc.audioEngine.setMusicVolume(0.25);
    },
    play_music(clip, is_loop) {
        this.curr_music = cc.audioEngine.playMusic(clip, is_loop);
        cc.audioEngine.setMusicVolume(0.25);
    },
    play_effect(clip, is_loop) {
        cc.audioEngine.stopAllEffects();

        cc.audioEngine.setMusicVolume(0.01);
        var id = cc.audioEngine.playEffect(clip, is_loop);
        cc.audioEngine.setFinishCallback(id, function() {
            cc.audioEngine.setMusicVolume(0.25);
        });
    },

    // update (dt) {},
});
sound_manager._instance = null;
sound_manager.getInstance = function() {
    if (!sound_manager._instance) {
        sound_manager._instance = new sound_manager();
    }
    return sound_manager._instance;
}
module.exports = sound_manager;