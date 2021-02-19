var game_mgr = require("game_mgr");
var event_mgr = require("event_mgr");
var res_mgr = require("res_mgr");

var scene_mgr_login = require("scene_mgr_login");

var game_app = cc.Class({
    extends: game_mgr,

    statics: {
        Instance: null,
    },

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
        if (game_app.Instance === null) {
            game_app.Instance = this;
        } else {
            cc.error("[error: game app instance");
            this.destroy();
            return;
        }

        // 调用父类onload
        game_mgr.prototype.onLoad.call(this);
    },

    start() {
        this.enter_login_scene();
    },


    enter_login_scene: function() {
        // 加载场景
        // 加载UI
        // 加载角色
        this.preload_scene(scene_mgr_login, function() {}, function() {
            this.enter_scene(scene_mgr_login);
        }.bind(this));
    },
    enter_home_scene: function() {

    },
    enter_game_scene: function() {

    },
    // update (dt) {},


    ////////////// event
    onBegin: function(event_name, udata) {
        cc.log("======onBegin", this, event_name, udata);
    },
});