// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var res_mgr = cc.Class({
    extends: cc.Component,

    statics: {
        Instance: null
    },
    properties: {
        // 启动资源，防止刚启动时候黑屏一下的问题 也可以放一个logo 加载完成后隐藏log显示资源
        launch_prefabs: {
            type: cc.Prefab,
            default: [],
        },
        launch_sprite_frames: {
            type: cc.SpriteFrame,
            default: [],
        },
        launch_audio_clips: {
            type: cc.AudioClip,
            default: [],
        },
        launch_sprite_altases: {
            type: cc.SpriteAtlas,
            default: [],
        },
        launch_jsons: {
            type: cc.JsonAsset,
            default: [],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (res_mgr.Instance === null) {
            res_mgr.Instance = this;
        } else {
            cc.error("[error: res_mgr instance");
            this.destroy();
            return;
        }
    },

    start() {

    },

    // res_set:{ prefabs: [], sprite_frames : [],  audio_clips : [], sprite_atlases : [], jsons : []}
    // on_progress : 进度条函数 function(per) per:[0,1]
    // on_load_finished 装载结束的函数  function(){}
    preload_res_pkg(res_set, on_progress, on_load_finished) {
        this.now_loaded = 0;
        this.total_num = 0;

        var key = null;
        for (key in res_set) {
            this.total_num += res_set[key].length;
        }

        if (this.total_num === 0) {
            if (on_load_finished) {
                on_load_finished();
            }
            return;
        }

        var self = this;
        for (key in res_set) {
            for (var i = 0; i < res_set[key].length; i++) {
                var url = res_set[key][i];
                cc.loader.loadRes(url, function(err, obj) {
                    if (err) {
                        cc.error("res_mgr ", err);
                    }

                    self.now_loaded++;
                    if (on_progress) {
                        on_progress(self.now_loaded / self.total_num);
                    }

                    if (self.now_loaded >= self.total_num) {
                        if (on_load_finished) {
                            on_load_finished();
                        }
                    }
                });
            }
        }
    },

    // 释放一个资源包集合
    release_res_pkg(res_set) {
        if (res_set.sprite_frames && res_set.sprite_frames.length > 0) {
            cc.loader.release(res_set.sprite_frames);
        }
        if (res_set.audio_clips && res_set.audio_clips.length > 0) {
            cc.loader.release(res_set.audio_clips);
        }
        if (res_set.sprite_atlases && res_set.sprite_atlases.length > 0) {
            cc.loader.release(res_set.sprite_atlases);
        }
        if (res_set.prefabs && res_set.prefabs.length > 0) { // prefab会依赖其他资源 不能直接传入数组
            for (var i = 0; i < res_set.prefabs.length; i++) {
                var url = res_set.prefabs[i];
                var deps = cc.loader.getDependsRecursively(url); // 获取依赖
                cc.loader.release(deps);
                cc.loader.release(url);
            }
        }
        // json文件先不回收了 不是很大
    },

    // 返回我们要获取的资源
    get_res(url) {
        return cc.loader.getRes(url);
    },
    // update (dt) {},
});