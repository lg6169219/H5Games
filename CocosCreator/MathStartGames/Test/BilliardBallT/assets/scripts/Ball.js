cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.startX = this.node.x;
        this.startY = this.node.y;
    },
    onBeginContact: function(contact, selfCollider, otherCollider) {
        if (otherCollider.node.groupIndex == 4) {
            // 与球带碰撞
            this.node.active = false;
            return;
        }
    },
    reset: function() {
        this.node.x = this.startX;
        this.node.y = this.startY;
        this.node.active = true;
    },
    // update (dt) {},
});