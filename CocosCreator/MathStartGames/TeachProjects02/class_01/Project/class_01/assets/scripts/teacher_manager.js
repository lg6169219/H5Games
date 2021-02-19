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
        ti1_input_text2: {
            type: cc.EditBox,
            default: null
        },
        ti1_input_text3: {
            type: cc.EditBox,
            default: null
        },
        ti1_input_text4: {
            type: cc.EditBox,
            default: null
        },
        ti1_input_text5: {
            type: cc.EditBox,
            default: null
        },
        ti1_input_text6: {
            type: cc.EditBox,
            default: null
        },
        ti1_res_text: {
            type: cc.Label,
            default: null
        },

        ti2_input_text1: {
            type: cc.EditBox,
            default: null
        },
        ti2_input_text2: {
            type: cc.EditBox,
            default: null
        },
        ti2_input_text3: {
            type: cc.EditBox,
            default: null
        },
        ti2_res_text: {
            type: cc.Label,
            default: null
        },


        ti3_input_text1: {
            type: cc.EditBox,
            default: null
        },
        ti3_input_text2: {
            type: cc.EditBox,
            default: null
        },
        ti3_input_text3: {
            type: cc.EditBox,
            default: null
        },
        ti3_res_text: {
            type: cc.Label,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var global_var = require('global_var');
        var list_1 = global_var.list[0];
        this.ti1_input_text1.string = list_1.content1_left;
        this.ti1_input_text2.string = list_1.content1_right;
        this.ti1_input_text3.string = list_1.content2_left;
        this.ti1_input_text4.string = list_1.content2_right;
        this.ti1_input_text5.string = list_1.content3_left;
        this.ti1_input_text6.string = list_1.content3_right;

        var list_2 = global_var.list[1];
        this.ti2_input_text1.string = list_2.content1_left;
        this.ti2_input_text2.string = list_2.content1_right;
        this.ti2_input_text3.string = list_2.content2_left;

        var list_3 = global_var.list[2];
        this.ti3_input_text1.string = list_3.content1_left;
        this.ti3_input_text2.string = list_3.content1_right;
        this.ti3_input_text3.string = list_3.content2_left;
    },

    start() {
        this.getTi1Result();
        this.getTi2Result();
        this.getTi3Result();
    },

    update(dt) {},

    getTi1Result() {
        this.t1_t1 = this.ti1_input_text1.string == "" ? 0 : parseInt(this.ti1_input_text1.string);
        this.t1_t2 = this.ti1_input_text2.string == "" ? 0 : parseInt(this.ti1_input_text2.string);

        this.t1_t3 = this.ti1_input_text1.string == "" ? 0 : parseInt(this.ti1_input_text3.string);
        this.t1_t4 = this.ti1_input_text1.string == "" ? 0 : parseInt(this.ti1_input_text4.string);

        this.t1_t5 = this.ti1_input_text1.string == "" ? 0 : parseInt(this.ti1_input_text5.string);
        this.t1_t6 = this.ti1_input_text1.string == "" ? 0 : parseInt(this.ti1_input_text6.string);

        var res = Math.ceil(this.t1_t5 * (this.t1_t2 / this.t1_t1) + this.t1_t6 * (this.t1_t4 / this.t1_t3));
        this.ti1_res_text.string = res + "";
        return res;
    },

    t1_textChanged() {
        this.getTi1Result();
    },

    getTi2Result() {
        this.t2_t1 = this.ti2_input_text1.string == "" ? 0 : parseInt(this.ti2_input_text1.string);
        this.t2_t2 = this.ti2_input_text2.string == "" ? 0 : parseInt(this.ti2_input_text2.string);

        this.t2_t3 = this.ti2_input_text3.string == "" ? 0 : parseInt(this.ti2_input_text3.string);


        var res = (this.t2_t1 / this.t2_t2) * this.t2_t3;
        this.ti2_res_text.string = res + "";
        return res;
    },

    t2_textChanged() {
        this.getTi2Result();
    },

    getTi3Result() {
        this.t3_t1 = this.ti3_input_text1.string == "" ? 0 : parseInt(this.ti3_input_text1.string);
        this.t3_t2 = this.ti3_input_text2.string == "" ? 0 : parseInt(this.ti3_input_text2.string);

        this.t3_t3 = this.ti3_input_text3.string == "" ? 0 : parseInt(this.ti3_input_text3.string);


        var res = (this.t3_t1 / this.t3_t2) * this.t3_t3;
        this.ti3_res_text.string = res + "";
        return res;
    },

    t3_textChanged() {
        this.getTi3Result();
    },

    sumbit() {
        var res_t1 = this.getTi1Result();
        var res_t2 = this.getTi2Result();
        var res_t3 = this.getTi3Result();

        if (res_t1 && res_t2 && res_t3) {
            var info = [
                { scene: "game_scene01", content1_left: this.t1_t1, content1_right: this.t1_t2, content2_left: this.t1_t3, content2_right: this.t1_t4, content3_left: this.t1_t5, content3_right: this.t1_t6, result: res_t1 },
                { scene: "game_scene02", content1_left: this.t2_t1, content1_right: this.t2_t2, content2_left: this.t2_t3, result: res_t2 },
                { scene: "game_scene03", content1_left: this.t3_t1, content1_right: this.t3_t2, content2_left: this.t3_t3, result: res_t3 },
            ];
            scene_mgr.getInstance().sendRequest("teacherReport", info);
        }
    },
});