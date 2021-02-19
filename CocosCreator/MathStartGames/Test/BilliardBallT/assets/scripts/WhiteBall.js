//WhiteBall.js 白球脚本

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
        cue: {
            type: cc.Node,
            default: null
        },

        min_distance: 20,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.on_touch_start.bind(this), this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move.bind(this), this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.on_touch_end.bind(this), this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.on_touch_end.bind(this), this);
    },

    start() {
        this.startX = this.node.x;
        this.startY = this.node.y;
    },

    on_touch_start: function() {
        this.body = this.node.getComponent(cc.RigidBody);
    },
    on_touch_move: function(e) {
        var w_pos = e.getLocation(); // 鼠标位置（世界坐标）
        var dst = this.node.parent.convertToNodeSpaceAR(w_pos);
        var node_pos = this.node.getPosition(); // 节点在父节点坐标系中的位置
        var dir = dst.sub(node_pos);
        var len = dir.mag();

        if (len <= this.min_distance) {
            this.cue.active = false;
            return;
        }

        this.cue.active = true;

        // 数学函数里角度是逆时针旋转，cocos里，物体的角度是顺时针旋转
        var r = Math.atan2(dir.y, dir.x);
        var degree = r * 180 / Math.PI;
        degree = 360 - degree + 180;
        this.cue.rotation = degree;

        var half_widht = this.cue.width * 0.5;
        // 画图 dir.x / len = new_x / half_widht;
        var new_x = half_widht * dir.x / len;
        var new_y = half_widht * dir.y / len;
        dst.x += new_x;
        dst.y += new_y;
        this.cue.setPosition(dst);
    },
    on_touch_end: function() {
        if (this.cue.active) {
            this.cue_comp = this.cue.getComponent("Cue");
            this.cue_comp.shoot_at(this.node.getPosition());
        }
    },
    update(dt) {},

    onBeginContact: function(contact, selfCollider, otherCollider) {
        if (otherCollider.node.groupIndex == 4) {
            // 与球带碰撞
            this.node.active = false;
            this.scheduleOnce(function() {
                this.reset();
            }.bind(this), 1);
        }
    },

    reset: function() {
        this.node.x = this.startX;
        this.node.y = this.startY;
        this.node.active = true;
    }
});