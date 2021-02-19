var event_mgr = require("event_mgr");
var res_mgr = require("res_mgr");

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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 初始化，框架里面的每个管理模块，所以这个是通用的
        cc.log("game_mgr on load");

        event_mgr.init();

        this.cur_scene = null;
    },

    start() {

    },

    enter_scene: function(scene) {
        if (scene === null) {
            return;
        }

        if (this.cur_scene !== null) {
            this.cur_scene.destroy(this.cur_scene !== scene);
        }

        this.cur_scene = scene;
        scene.enter();
    },

    preload_scene: function(scene, on_progress, on_finished) {
        scene.preload(on_progress, on_finished);
    },
    // update (dt) {},
});