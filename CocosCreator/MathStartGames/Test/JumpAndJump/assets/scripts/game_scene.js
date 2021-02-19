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
        player: {
            type: cc.Node,
            default: null
        },
        block_prefabs: {
            type: cc.Prefab,
            default: []
        },
        block_root: {
            default: null,
            type: cc.Node
        },
        left_org: cc.v2(0, 0),
        map_root: {
            default: null,
            type: cc.Node
        },
        y_radio: 0.5560472,
        checkout: {
            type: cc.Node,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.block_list = [];

        this.cur_block = cc.instantiate(this.block_prefabs[Math.floor(Math.random() * this.block_prefabs.length)]);
        this.block_root.addChild(this.cur_block);
        // 将第一个块的位置设置为初始位置
        this.cur_block.setPosition(this.block_root.convertToNodeSpaceAR(this.left_org));

        var w_pos = this.cur_block.getChildByName('mid').convertToWorldSpaceAR(cc.v2(0, 0));
        this.player.setPosition(this.map_root.convertToNodeSpaceAR(w_pos));
        this.next_block = this.cur_block;
        this.player_comp = this.player.getComponent("player");

        this.block_zOrder = -1;
        this.add_block();
    },
    add_block: function() {
        this.cur_block = this.next_block;

        this.next_block = cc.instantiate(this.block_prefabs[Math.floor(Math.random() * this.block_prefabs.length)]);
        this.block_root.addChild(this.next_block);

        this.next_block.zIndex = this.block_zOrder;
        this.block_zOrder--;

        var x_distance = 200 + Math.random() * 200;
        var y_distance = x_distance * this.y_radio;

        var next_pos = this.cur_block.getPosition();
        next_pos.x += x_distance * this.player_comp.direction;
        next_pos.y += y_distance;
        this.next_block.setPosition(next_pos);

        this.player_comp.set_next_block(this.next_block.getComponent("block"));

        // 删除block
        this.block_list.push(this.next_block);
        if (this.block_list.length >= 5) {
            for (var i = 0; i < 2; i++) {
                var block = this.block_list.shift();
                block.destroy();
            }
        }
    },

    // 地图滚动
    move_map(offset_x, offset_y) {
        var m1 = cc.moveBy(0.5, offset_x, offset_y);
        var end_func = cc.callFunc(function() {
            this.add_block();
        }.bind(this));

        var seq = cc.sequence([m1, end_func]);
        this.map_root.runAction(seq);
    },
    on_checkout_game: function() {
        this.checkout.active = true;
    },
    on_game_again: function() {
        cc.director.loadScene("game_scene");
    },
    // update (dt) {},
});