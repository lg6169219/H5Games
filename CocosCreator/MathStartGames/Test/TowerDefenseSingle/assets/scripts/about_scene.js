// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        this.anchor_center = this.node.getChildByName("anchor-center");
        this.anchor_center.getChildByName("btn_back").on(cc.Node.EventType.TOUCH_START, this.back_home_scene, this);

        this.go_back = false;
    },

    start() {

        this.loading_door_comp = this.anchor_center.getChildByName("loading_door").getComponent("loading_door");
        this.loading_door_comp.open_the_door();
    },

    back_home_scene: function() {
        if (this.go_back) {
            return;
        }
        this.go_back = true;

        this.loading_door_comp.close_the_door(function() {
            cc.director.loadScene("home_scene", function() {
                var home_scene = cc.find("UI_ROOT").getComponent("home_scene");
            });
        }.bind(this));
    },
    // update (dt) {},
});