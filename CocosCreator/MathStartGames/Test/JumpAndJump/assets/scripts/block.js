// block.js
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
    start() {
        this.mid = this.node.getChildByName("mid");
        this.up = this.node.getChildByName("up");
        this.down = this.node.getChildByName("down");

        this.left = this.node.getChildByName("left");
        this.right = this.node.getChildByName("right");
    },

    // dir 1右跳 -1左跳
    is_jump_on_block(w_dst_pos, direction) {
        var mid_pos = this.mid.convertToWorldSpaceAR(cc.v2(0, 0));
        var dir = w_dst_pos.sub(mid_pos);
        var min_len = dir.mag();
        var min_pos = mid_pos;

        if (direction === 1) {
            var up_pos = this.up.convertToWorldSpaceAR(cc.v2(0, 0));
            dir = w_dst_pos.sub(up_pos);
            var len = dir.mag();
            if (min_len > len) {
                min_len = len;
                min_pos = up_pos;
            }
            var down_pos = this.down.convertToWorldSpaceAR(cc.v2(0, 0));
            dir = w_dst_pos.sub(down_pos);
            var len = dir.mag();
            if (min_len > len) {
                min_len = len;
                min_pos = down_pos;
            }
        } else {
            var left_pos = this.left.convertToWorldSpaceAR(cc.v2(0, 0));
            dir = w_dst_pos.sub(left_pos);
            var len = dir.mag();
            if (min_len > len) {
                min_len = len;
                min_pos = left_pos;
            }
            var right_pos = this.right.convertToWorldSpaceAR(cc.v2(0, 0));
            dir = w_dst_pos.sub(right_pos);
            var len = dir.mag();
            if (min_len > len) {
                min_len = len;
                min_pos = right_pos;
            }
        }

        // 找到跳跃位置距离参考点最近的那个点以及位置
        dir = w_dst_pos.sub(min_pos);
        if (dir.mag() < 100) {
            w_dst_pos.x = min_pos.x;
            w_dst_pos.y = min_pos.y;
            return true;
        }
        return false;
    },
});