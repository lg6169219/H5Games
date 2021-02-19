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
        star_num: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.star_set = [null, null, null];
        for (let i = 0; i <= 2; i++) {
            this.star_set[i] = this.node.getChildByName("star" + (i + 1)).getChildByName("star");
        }

        this.show_level_star_info(this.star_num);
    },

    start() {},
    // 显示当前关卡的成绩
    show_level_star_info: function(star_num) {
        if (star_num < 0 || star_num > 3) {
            return;
        }

        var i;
        for (i = 0; i < star_num; i++) {
            this.star_set[i].active = true;
        }

        for (; i < 3; i++) {
            this.star_set[i].active = false;
        }
        this.star_num = star_num;
    },
    // update (dt) {},
});