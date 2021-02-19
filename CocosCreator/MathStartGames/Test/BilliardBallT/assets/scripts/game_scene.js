//game_scene.js

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
        balls: {
            default: null,
            type: cc.Node
        },
        white_ball: {
            type: cc.Node,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.is_game_started = true;
    },
    check_game_over: function() {
        if (!this.is_game_started) {
            return;
        }
        for (var i = 0; i < this.balls.childrenCount; i++) {
            var child = this.balls.children[i];
            if (child.active === true) {
                return;
            }
        }

        this.is_game_started = false;
        this.scheduleOnce(this.restart_game.bind(this), 5);
    },
    restart_game: function() {
        for (var i = 0; i < this.balls.childrenCount; i++) {
            var b = this.balls.children[i];
            b.getComponent("Ball").reset();
        }

        this.white_ball.getComponent("WhiteBall").reset();
        this.is_game_started = true;
    },
    update(dt) {
        this.check_game_over();
    },
});