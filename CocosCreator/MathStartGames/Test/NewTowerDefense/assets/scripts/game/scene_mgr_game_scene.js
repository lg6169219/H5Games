var res_mgr = require("res_mgr");
var event_mgr = require("event_mgr");
var ui_manager = require("ui_manager");

// 标准资源包的格式;
var res_pkg = {
    prefabs: [
        "prefabs/level1_map",
    ],

    sprite_frames: [],

    audio_clips: [],

    sprite_atlases: [],
};

var scene = {
    preload(on_process, on_finished) {
        // 你还可以装载其它的资源包
        // end 
        res_mgr.Instance.preload_res_pkg(res_pkg, on_process, on_finished);
    },

    enter() {
        this.canvas = cc.find("Canvas");
        if (this.canvas === null) {
            cc.error("game_app canvas");
        }


        // event_mgr.add_event_listener("begin", this, this.onBegin);
        // event_mgr.add_event_listener("begin", this, this.onBegin);
        // event_mgr.add_event_listener("begin", this, this.onBegin);

        // event_mgr.remove_event_listener("begin", this, this.onBegin);


        // event_mgr.dispatch_event("begin", 111);

        // var pkg = {
        //     prefabs: ["prefabs/ui_root"]
        // }
        // res_mgr.Instance.preload_res_pkg(
        //     pkg,
        //     function(per) {
        //         console.log("===========ssss ", per);
        //     },
        //     function() {
        //         this.ui = cc.instantiate(res_mgr.Instance.get_res("prefabs/ui_root"));
        //         this.canvas.addChild(this.ui);
        //     }.bind(this),
        // );

        this.level_map = cc.instantiate(res_mgr.Instance.get_res("prefabs/level1_map"));
        this.canvas.addChild(this.level_map);

        // for(var i = 1; i <= 6; i++){
        //     this.level_map.getChildByName("t" + i);
        // }
        // 最终替换为ui_manager.show_ui_at
        // ui_manager.show_ui_at(this.canvas, "scene_mgr_game_scene");
    },

    // 删除当前场景的数据, 
    // bRelease:是否执行资源卸载; // 同一个场景切换的时候，可能不用卸载资源
    // bRelease一般为true,只有同一个场景切换到新的自己这个场景，为false;
    destroy(bRelease) {
        this.level_map.removeFromParent();

        ui_manager.removeAll(this.canvas);

        // 卸载哪些资源包由你自己根据游戏决定;
        if (bRelease) { // 你要释放的资源包;
            // res_mgr.Instance.release_res_pkg(res_pkg);

        }
    },
};

module.exports = scene;