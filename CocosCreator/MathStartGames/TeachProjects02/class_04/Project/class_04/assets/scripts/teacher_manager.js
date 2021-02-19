// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var scene_mgr = require('scene_manager')
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
        ti1_input_text1: {
            type: cc.EditBox,
            default: null
        },
        ti2_input_text1: {
            type: cc.EditBox,
            default: null
        },
        ti3_input_text1: {
            type: cc.EditBox,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var global_var = require('global_var');
        var list_1 = global_var.list[0];
        this.ti1_input_text1.string = list_1.index;

        var list_2 = global_var.list[1];
        this.ti2_input_text1.string = list_2.index;

        var list_3 = global_var.list[2];
        this.ti3_input_text1.string = list_3.index;
    },

    start() {},

    // update(dt) {},

    getTi1Result() {
        this.t1_t1 = this.ti1_input_text1.string == "" ? 0 : parseInt(this.ti1_input_text1.string);
    },

    getTi2Result() {
        this.t2_t1 = this.ti2_input_text1.string == "" ? 0 : parseInt(this.ti2_input_text1.string);
    },

    getTi3Result() {
        this.t3_t1 = this.ti3_input_text1.string == "" ? 0 : parseInt(this.ti3_input_text1.string);
    },

    sumbit() {
        this.getTi1Result();
        this.getTi2Result();
        this.getTi3Result();

        var info = [];
        for (var i = 1; i <= 3; i++) {
            if (this["t" + i + "_t1"] !== 0) {
                info.push({ index: this["t" + i + "_t1"] });
            }
        }
        console.log(info);
        if (info.length > 0) {
            scene_mgr.getInstance().sendRequest("teacherReport", info);
        }
    },
});