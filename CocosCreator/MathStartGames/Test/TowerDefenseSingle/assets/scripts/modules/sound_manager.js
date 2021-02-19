var sound_manager = {
    b_music_mute: -1, //背景音乐是否静音 0不静音 1静音
    b_effect_mute: -1, //音效是否静音 0不静音 1静音

    set_music_mute: function(b_mute) {
        if (this.b_music_mute === b_mute) {
            return;
        }

        this.b_music_mute = (b_mute) ? 1 : 0;
        if (this.b_music_mute === 1) {
            cc.audioEngine.setMusicVolume(0.01);

        } else if (this.b_music_mute === 0) {
            cc.audioEngine.setMusicVolume(1);
        }

        cc.sys.localStorage.setItem("music_mute", this.b_music_mute);
    },

    set_effect_mute: function(b_mute) {
        if (this.b_effect_mute === b_mute) {
            return;
        }

        this.b_effect_mute = (b_mute) ? 1 : 0;

        if (this.b_effect_mute === 1) {
            cc.audioEngine.setEffectsVolume(0);
        } else if (this.b_effect_mute === 0) {
            cc.audioEngine.setEffectsVolume(1);
        }

        cc.sys.localStorage.setItem("effect_mute", this.b_effect_mute);
    },

    // 播放背景音乐
    play_music: function(audioClip, loop) {
        cc.audioEngine.playMusic(audioClip, loop);
        if (this.b_music_mute) {
            cc.audioEngine.setMusicVolume(0.01);
        } else {
            cc.audioEngine.setMusicVolume(1);
        }
    },

    play_effect: function(audioClip) {
        if (this.b_effect_mute) {
            return;
        }
        cc.audioEngine.playEffect(audioClip);
    },
};

// 启动时读取本地数据
var music_mute = cc.sys.localStorage.getItem("music_mute");
if (music_mute) {
    music_mute = parseInt(music_mute);
} else {
    music_mute = 0;
}
sound_manager.set_music_mute(music_mute);

var effect_mute = cc.sys.localStorage.getItem("effect_mute");
if (effect_mute) {
    effect_mute = parseInt(effect_mute);
} else {
    effect_mute = 0;
}
sound_manager.set_effect_mute(effect_mute);

module.exports = sound_manager;