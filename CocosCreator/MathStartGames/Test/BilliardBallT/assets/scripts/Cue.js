// Cue.js

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
        SHOOT_POWER: 18,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.body = this.node.getComponent(cc.RigidBody);
    },

    shoot_at: function(dst) {
        // 施加冲量
        // 方向 当前位置--->目标
        var dir = dst.sub(this.node.getPosition());
        // 大小
        var len = dir.mag();
        var half_width = this.node.width * 0.5;
        var dis = len - half_width;
        var power_x = dis * this.SHOOT_POWER * dir.x / len;
        var power_y = dis * this.SHOOT_POWER * dir.y / len;

        // applyLinearImpulse(冲量大小向量，球杆的原点转为世界坐标，是否立刻唤醒true)
        this.body.applyLinearImpulse(cc.v2(power_x, power_y), this.node.convertToWorldSpaceAR(cc.v2(0, 0)), true);
    },
    // update (dt) {},
    onPreSolve: function(contact, selfCollider, otherCollider) {
        this.node.active = false;
    },
});