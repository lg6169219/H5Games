// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var scene_mgr = require("../scene_manager");

cc.Class({
    extends: cc.Component,

    properties: {
        prefab_fruit: {
            type: cc.Prefab,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.path_farther_operate = "Canvas/ti_content2/content1";

        this.get_num = 0;

        this.nodePool = new cc.NodePool("Xigua");

        this.remove_fruit = null;

        // // 移除一个水果
        // this.node.on(cc.Node.EventType.TOUCH_START, function(e) {
        //     if (this.remove_fruit)
        //         return;
        //     if (this.get_num <= 0) {
        //         return;
        //     }
        //     this.node_self_operate.getComponent(cc.Layout).enabled = false;

        //     var w_pos = e.getLocation();
        //     var pos = this.node.parent.parent.convertToNodeSpaceAR(w_pos);
        //     this.remove_fruit = this.nodePool.get();
        //     if (!this.remove_fruit) {
        //         this.remove_fruit = cc.instantiate(this.prefab_fruit);
        //     }
        //     this.node.parent.parent.addChild(this.remove_fruit);
        //     this.remove_fruit.setSiblingIndex(50);
        //     this.remove_fruit.setPosition(pos);
        // }.bind(this), this);

        // this.node.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
        //     if (!this.remove_fruit)
        //         return;

        //     var w_pos = e.getLocation();
        //     var pos = this.node.parent.parent.convertToNodeSpaceAR(w_pos);
        //     this.remove_fruit.setPosition(pos);
        // }.bind(this), this);

        // this.node.on(cc.Node.EventType.TOUCH_END, function() {
        //     if (!this.remove_fruit)
        //         return;
        //     this.nodePool.put(this.remove_fruit);
        //     this.remove_fruit = null;
        // }.bind(this), this);

        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
        //     if (!this.remove_fruit)
        //         return;
        //     var w_pos = e.getLocation();
        //     this.removeFromRightRound(w_pos);
        // }.bind(this), this);
    },

    start() {
        this.node_father_operate = cc.find(this.path_farther_operate);
        this.node_self_operate = this.node.getChildByName("operate");

        this.scene_comp = cc.director.getScene().getChildByName('Canvas').getComponent("game_scene01");
        if(this.scene_comp == null){
            this.scene_comp = cc.director.getScene().getChildByName('Canvas').getComponent("game_scene02");
        }
        if(this.scene_comp == null){
            this.scene_comp = cc.director.getScene().getChildByName('Canvas').getComponent("game_scene03");
        }
    },

    add_node: function() {
        this.node_self_operate.getComponent(cc.Layout).enabled = true;

        scene_mgr.getInstance().play_click_effect();

        var new_node = cc.instantiate(this.prefab_fruit);
        this.node_self_operate.addChild(new_node);
        this.get_num++;

        new_node.on(cc.Node.EventType.TOUCH_START, function(e) {
            if (this.remove_fruit)
                return;
            if (this.get_num <= 0) {
                return;
            }
            this.node_self_operate.getComponent(cc.Layout).enabled = false;

            this.remove_fruit = new_node;
            this.remove_fruit.opacity = 0;

            this.create_fruit = cc.instantiate(this.prefab_fruit);
            this.node.parent.addChild(this.create_fruit, 10);
            this.start_x = new_node.x;
            this.start_y = new_node.y;

            let index = this.node.parent.getSiblingIndex();
            this.node.parent.setSiblingIndex(index + 2);
        }.bind(this), this);

        new_node.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
            if (!this.remove_fruit)
                return;

            var delta = e.getDelta();
            // this.remove_fruit.x += delta.x;
            // this.remove_fruit.y += delta.y;

            let w_pos = e.getLocation();
            let new_pos = this.node.parent.convertToNodeSpaceAR(w_pos);
            this.create_fruit.x = new_pos.x;
            this.create_fruit.y = new_pos.y;
        }.bind(this), this);

        new_node.on(cc.Node.EventType.TOUCH_END, function(e) {
            if (!this.remove_fruit)
                return;
            var w_pos = e.getLocation();
            this.removeFromRightRound(w_pos);
        }.bind(this), this);

        new_node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
            if (!this.remove_fruit)
                return;
            var w_pos = e.getLocation();
            this.removeFromRightRound(w_pos);
        }.bind(this), this);
    },

    remove_node: function() {
        if (this.get_num <= 0) {
            return;
        }
        this.remove_fruit.removeFromParent();
        // for (var i = this.node_self_operate.children.length - 1; i >= 0; i--) {
        //     if (this.node_self_operate.children[i].group == "node_prefab") {
        //         this.node_self_operate.children[i].removeFromParent();
        //         break;
        //     }
        // }
    },
    // update (dt) {},

    removeFromRightRound(pos) {
        var new_pos = this.node_father_operate.convertToWorldSpaceAR(cc.v2(0, 0));
        var a = new cc.Rect(new_pos.x - this.node_father_operate.width / 2, new_pos.y - this.node_father_operate.height / 2, this.node_father_operate.width, this.node_father_operate.height);
        var b = new cc.Vec2(pos.x, pos.y);
        if (this.remove_fruit && a.contains(b)) {
            this.remove_node();
            this.get_num--;
            this.remove_fruit = null;
            this.scene_comp.add_node();
        } else {
            if (this.remove_fruit) {
                this.remove_fruit.opacity = 255;
                this.remove_fruit.x = this.start_x;
                this.remove_fruit.y = this.start_y;
                this.remove_fruit = null;
            }
        }

        if(this.create_fruit){
            this.create_fruit.removeFromParent();
        }
    },
});