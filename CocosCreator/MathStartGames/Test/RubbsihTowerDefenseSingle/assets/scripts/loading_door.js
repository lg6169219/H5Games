var sound_manager = require("sound_manager");

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
        this.left_door = this.node.getChildByName("left_door");
        this.right_door = this.node.getChildByName("right_door");

        this.state = -1; // 0关 1开

        this.duration = 0.5;

        this.set_the_door(0);
    },

    start() {
        // this.set_the_door(1);
    },

    set_the_door: function(state) {
        if (this.state === state) {
            return;
        }

        this.state = state;

        let win_size = cc.winSize;
        if (this.state === 0) {
            this.left_door.x = -(win_size.width * 0.5 + 5); //-228;
            this.right_door.x = (win_size.width * 0.5 + 5); //228;
        } else if (this.state === 1) {
            this.left_door.x += -(win_size.width * 0.5 + 5);
            this.right_door.x += (win_size.width * 0.5 + 5);
        }
    },
    open_the_door: function(end_func) {
        if (this.state === 1) {
            return;
        }
        this.state = 1;
        let win_size = cc.winSize;


        let m1 = cc.moveBy(this.duration, -(win_size.width * 0.5 + 5), 0);
        this.left_door.runAction(m1);

        let m2 = cc.moveBy(this.duration, win_size.width * 0.5 + 5, 0);

        let func = cc.callFunc(function() {
            if (CC_DEBUG) {
                console.log("========open_the_door_end");
            }

            if (end_func) {
                end_func();
            }
        }, this);
        let seq = cc.sequence([m2, func]);
        this.right_door.runAction(seq);
    },
    close_the_door: function(end_func) {
        if (this.state === 0) {
            return;
        }
        this.state = 0;

        let win_size = cc.winSize;
        // let m1 = cc.moveBy(this.duration, win_size.width * 0.5 + 5, 0);
        let m1 = cc.moveTo(this.duration, 0 - this.left_door.width / 2 + 5, 0);

        this.left_door.runAction(m1);

        // let m2 = cc.moveBy(this.duration, -(win_size.width * 0.5 + 5), 0);
        let m2 = cc.moveTo(this.duration, 0 + this.right_door.width / 2 - 5, 0);

        let func = cc.callFunc(function() {
            if (CC_DEBUG) {
                console.log("========close_the_door_end");
            }
            cc.loader.loadRes("sounds/close_door", cc.AudioClip, function(err, clip) {
                sound_manager.play_effect(clip);
            });

            if (end_func) {
                end_func();
            }
        }, this);
        let seq = cc.sequence([m2, func]);
        this.right_door.runAction(seq);
    },
    // update (dt) {},
});