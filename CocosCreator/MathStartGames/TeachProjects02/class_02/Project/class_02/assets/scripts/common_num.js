/**
* 规则的设定，按照信号灯样式，8就是由7根火柴棍组成
* 设定变化规则：
*
*      ***1***
       *4    *5
*      ***2***
*      *6    *7
*      ***3***
*
* add：    
        0:{
            2 -> 8
        }
        1:{
            1 -> 7
        }
        2:{
        } 
        3:{
            4 -> 9
        }
        4:{
        }
        5:{
            6 -> 6
            5 -> 9
        }
        6:{
          5 -> 8  
        }
        7:{
        }
        8:{
        }
        9:{
            6 -> 8
        }
*        1-》7
*        3-》9
*        5-》6,9
*        6-》8
*        9-》8
*        - -》+，=
* sub： 6-》5
*        7-》1
*        8-》0.6,9
*        9->3,5
*        + -> -
*        = -> -
* mv:    0 -> 6,9
*        2 -> 3
*        3 -> 2,5
*        6 -> 9
*        9 -> 0,6
*/
cc.Class({
    extends: cc.Component,

    properties: {
        num_value: 0,
        opt_type: 0, // 0 可移动(自身、外部)  1可以移除  2可增加 3自身内移动(需求 可以在自身瞎几把移))
    },

    // LIFE-CYCLE CALLBACKS:
    // 10 代表+  11代表-
    onLoad() {
        let node_di = this.node.getChildByName("node_di");
        if (node_di && node_di != null){
            node_di.active = false;
        }
        let node_di_add = this.node.getChildByName("node_di_add");
        if (node_di_add && node_di_add != null){
            node_di_add.active = false;
        }
        let node_di_sub = this.node.getChildByName("node_di_sub");
        if (node_di_sub && node_di_sub != null){
            node_di_sub.active = false;
        }

        if (!CC_DEBUG) {
            for (let i = 1; i <= 7; i++) {
                let node_name = "node_" + i;
                let curr_node = this.node.getChildByName(node_name);
                if (curr_node) {
                    let lab = curr_node.getChildByName("New Label");
                    if (lab) {
                        lab.active = false;
                    }
                }
            }
        }
        // 自身移动
        this.can_mov_list = {
            0: {
                node_5: { to_pos: "node_2", value: 6 },
                node_6: { to_pos: "node_2", value: 9 },
            },
            2: {
                node_6: { to_pos: "node_7", value: 3 },
            },
            3: {
                node_5: { to_pos: "node_4", value: 5 },
                node_7: { to_pos: "node_6", value: 2 },
            },
            5: {
                node_4: { to_pos: "node_5", value: 3 },
            },
            6: {
                node_2: { to_pos: "node_5", value: 0 },
                node_6: { to_pos: "node_5", value: 9 },
            },
            9: {
                node_2: { to_pos: "node_6", value: 0 },
                node_5: { to_pos: "node_6", value: 6 },
            }
        };

        this.can_sub_list = {
            6: {
                node_6: { value: 5 }
            },
            7: {
                node_1: { value: 1 }
            },
            8: {
                node_2: { value: 0 },
                node_5: { value: 6 },
                node_6: { value: 9 }
            },
            9: {
                node_4: { value: 3 },
                node_5: { value: 5 }
            },
            10: {
                node_1: { value: 11 }
            }
        };

        this.can_add_list = {
            0: {
                node_2: { value: 8 }
            },
            1: {
                node_1: { value: 7 }
            },
            3: {
                node_4: { value: 9 }
            },
            5: {
                node_5: { value: 9 },
                node_6: { value: 6 },
            },
            6: {
                node_5: { value: 8 }
            },
            9: {
                node_6: { value: 8 }
            },
            11: {
                node_1: { value: 10 }
            }
        };

        // 每个数字由哪几个位置的火柴组成
        this.self_stick_list = {
            0: {
                node_1: true,
                node_2: false,
                node_3: true,
                node_4: true,
                node_5: true,
                node_6: true,
                node_7: true,
            },
            1: {
                node_1: false,
                node_2: false,
                node_3: false,
                node_4: false,
                node_5: true,
                node_6: false,
                node_7: true,
            },
            2: {
                node_1: true,
                node_2: true,
                node_3: true,
                node_4: false,
                node_5: true,
                node_6: true,
                node_7: false,
            },
            3: {
                node_1: true,
                node_2: true,
                node_3: true,
                node_4: false,
                node_5: true,
                node_6: false,
                node_7: true,
            },
            4: {
                node_1: false,
                node_2: true,
                node_3: false,
                node_4: true,
                node_5: true,
                node_6: false,
                node_7: true,
            },
            5: {
                node_1: true,
                node_2: true,
                node_3: true,
                node_4: true,
                node_5: false,
                node_6: false,
                node_7: true,
            },
            6: {
                node_1: true,
                node_2: true,
                node_3: true,
                node_4: true,
                node_5: false,
                node_6: true,
                node_7: true,
            },
            7: {
                node_1: true,
                node_2: false,
                node_3: false,
                node_4: false,
                node_5: true,
                node_6: false,
                node_7: true,
            },
            8: {
                node_1: true,
                node_2: true,
                node_3: true,
                node_4: true,
                node_5: true,
                node_6: true,
                node_7: true,
            },
            9: {
                node_1: true,
                node_2: true,
                node_3: true,
                node_4: true,
                node_5: true,
                node_6: false,
                node_7: true,
            },
            10: {
                node_1: true,
                node_2: true,
                node_3: false,
                node_4: false,
                node_5: false,
                node_6: false,
                node_7: false,
            },
            11: {
                node_1: false,
                node_2: true,
                node_3: false,
                node_4: false,
                node_5: false,
                node_6: false,
                node_7: false,
            }
        }
    },
    start() {
        var curr_scene = cc.director.getScene();
        var canvas = curr_scene.getChildByName("Canvas");
        this.curr_scene_comp = canvas.getComponent(curr_scene.name);

        // let can_drag = this.opt_type === 0;
        // let can_sub = this.opt_type === 1;
        // let can_add = this.opt_type === 2;
        // this.opt_type === 3;

        for (let i = 1; i <= 7; i++) {
            let node_name = "node_" + i;
            let curr_node = this.node.getChildByName(node_name);
            if (curr_node) {
                curr_node.on(cc.Node.EventType.TOUCH_START, function() {
                    if (this.curr_scene_comp.can_use_times <= 0) {
                        return;
                    }

                    let node_sprite = this.get_stick_sprite_node(curr_node);
                    if (this.opt_type === 1) {
                        if (node_sprite && node_sprite.active === true) {
                            let from_node_val = this.sub_one_stick(this.num_value, node_name);
                            if (from_node_val !== -1) {
                                // from 变 from_node_val  to变to_node_val
                                this.curr_scene_comp.change_num(this.node, from_node_val);
                            } else {
                                node_sprite.active = false;
                            }
                            this.curr_scene_comp.sub_one_stick(this.node, from_node_val); // 次数减1
                        }
                    } else if (this.opt_type === 2) {
                        if (node_sprite && node_sprite.active === false) {
                            let to_node_val = this.add_one_stick(this.num_value, node_name);
                            if (to_node_val !== -1) {
                                this.curr_scene_comp.change_num(this.node, to_node_val);
                            } else {
                                node_sprite.active = true;
                            }
                            this.curr_scene_comp.sub_one_stick(this.node, to_node_val); // 次数减1
                        }
                    }
                    if (this.opt_type === 0 || this.opt_type === 3 && node_sprite && node_sprite.active === true) {
                        this.start_x = curr_node.x;
                        this.start_y = curr_node.y;
                    }
                }.bind(this), this);

                curr_node.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
                    let node_sprite = this.get_stick_sprite_node(curr_node);
                    if ((this.opt_type === 0 || this.opt_type === 3) && (node_sprite && node_sprite.active === true)) {
                        if (this.curr_scene_comp.can_use_times <= 0) {
                            return;
                        }
                        var delta = e.getDelta();
                        curr_node.x += delta.x / this.node.scale;
                        curr_node.y += delta.y / this.node.scale;
                    }
                }.bind(this), this);

                curr_node.on(cc.Node.EventType.TOUCH_END, function(e) {
                    let node_sprite = this.get_stick_sprite_node(curr_node);
                    if ((this.opt_type === 0 || this.opt_type === 3) && (node_sprite && node_sprite.active === true)) {
                        this.is_mov_in_right_area(curr_node);
                    }
                }.bind(this), this);

                curr_node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
                    let node_sprite = this.get_stick_sprite_node(curr_node);
                    if ((this.opt_type === 0 || this.opt_type === 3) && (node_sprite && node_sprite.active === true)) {
                        this.is_mov_in_right_area(curr_node);
                    }
                }.bind(this), this);
            }
        }
    },
    // 辅助函数 获取node上的node_stick_shu node_stick_heng节点
    get_stick_sprite_node: function(node) {
        let node_heng = node.getChildByName("node_stick_heng");
        let node_shu = node.getChildByName("node_stick_shu");
        return node_heng === null ? node_shu : node_heng;
    },
    // 判断在自己内部移动
    is_mov_in_right_area(drag_node) {
        if (this.curr_scene_comp.can_use_times <= 0) {
            return;
        }

        var drag_node_world_pos = drag_node.convertToWorldSpaceAR(cc.v2(0, 0));
        var parent_node_world_pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        var a = new cc.Rect(parent_node_world_pos.x - this.node.width / 2, parent_node_world_pos.y - this.node.height / 2, this.node.width, this.node.height);
        var b = new cc.Vec2(drag_node_world_pos.x, drag_node_world_pos.y);

        var change_val = -1;

        // 自身内部
        if (a.contains(b)) {
            let contain_node = null;
            for (let i = 1; i <= 7; i++) {
                let node_name = "node_" + i;
                let curr_node = this.node.getChildByName(node_name);
                if (curr_node && curr_node != drag_node) {
                    let node_pos = curr_node.convertToWorldSpaceAR(cc.v2(0, 0));
                    var node_pos_rect = new cc.Rect(node_pos.x - curr_node.width / 2, node_pos.y - curr_node.height / 2, curr_node.width, curr_node.height);
                    if (node_pos_rect.contains(b)) {
                        // mov_one_stick判断能否放在新的位置 变成新的数字
                        contain_node = this.opt_type === 3 ? curr_node : null;
                        change_val = this.mov_one_stick(this.num_value, drag_node.name, node_name);
                        break;
                    }
                }
            }
            if (change_val === -1) {
                // 回归原位
                drag_node.setPosition(this.start_x, this.start_y);
                if (contain_node !== null) {
                    let sprite = this.get_stick_sprite_node(contain_node);
                    if (sprite.active === false) {
                        // 有空位
                        sprite.active = true;

                        let sprite2 = this.get_stick_sprite_node(drag_node);
                        sprite2.active = false;
                    }
                }
            } else {
                //change_val
                this.curr_scene_comp.change_num(this.node, change_val, true);
            }
        } else {
            // 外部
            // 如果碰到了其他节点，判断是否能与其他节点组合（1、自己删除  2、其他节点对应位置增加）
            // 否则返回原位
            let children_lenght = this.node.parent.children.length;
            for (let i = 0; i < children_lenght; i++) {

                let child_node = this.node.parent.children[i];

                if (child_node && child_node.group == "node_use" && child_node != this.node) {
                    let node_pos = child_node.convertToWorldSpaceAR(cc.v2(0, 0));
                    var node_pos_rect = new cc.Rect(node_pos.x - child_node.width / 2, node_pos.y - child_node.height / 2, child_node.width, child_node.height);

                    if (node_pos_rect.contains(b)) {

                        let child_node_commom_num = child_node.getComponent("common_num");
                        // 找孩子
                        for (let j = 1; j <= 7; j++) {
                            let node_name = "node_" + j;
                            let curr_node = child_node.getChildByName(node_name);
                            if (curr_node) {
                                let node_pos = curr_node.convertToWorldSpaceAR(cc.v2(0, 0));
                                var node_pos_rect = new cc.Rect(node_pos.x - curr_node.width / 2, node_pos.y - curr_node.height / 2, curr_node.width, curr_node.height);
                                if (node_pos_rect.contains(b)) {
                                    // mov_one_stick判断能否放在新的位置 变成新的数字
                                    let from_node_val = this.sub_one_stick(this.num_value, drag_node.name);
                                    let to_node_val = this.add_one_stick(child_node_commom_num.num_value, node_name);

                                    if (from_node_val !== -1 && to_node_val !== -1) {
                                        change_val = 0;
                                        // from 变 from_node_val  to变to_node_val
                                        this.curr_scene_comp.change_num(this.node, from_node_val, true);
                                        this.curr_scene_comp.change_num(child_node, to_node_val);
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }

            if (change_val === -1) {
                // 没有的话 回归原位
                drag_node.setPosition(this.start_x, this.start_y);
            }
        }
    },

    // 自身内移动一根
    mov_one_stick: function(num_value, from_pos_name, to_pos_name) {
        var mov_list = this.can_mov_list[num_value];
        if (mov_list && mov_list[from_pos_name] && mov_list[from_pos_name].to_pos == to_pos_name) {
            let new_val = mov_list[from_pos_name].value;
            return new_val;
        }
        return -1;
    },
    // 减掉一根
    sub_one_stick: function(num_value, from_pos_name) {
        if (this.opt_type === 3) {
            return -1;
        }
        var sub_list = this.can_sub_list[num_value];
        if (sub_list && sub_list[from_pos_name]) {
            let new_val = sub_list[from_pos_name].value;
            return new_val;
        }
        return -1;
    },
    // 增加一根
    add_one_stick: function(num_value, to_pos_name) {
        if (this.opt_type === 3) {
            return -1;
        }
        var add_list = this.can_add_list[num_value];
        if (add_list && add_list[to_pos_name]) {
            let new_val = add_list[to_pos_name].value;
            return new_val;
        }
        return -1;
    },
    get_sub_one_info: function() {
        var sub_list = this.can_sub_list[this.num_value];
        return sub_list;
    },
    get_add_one_info: function() {
        var add_list = this.can_add_list[this.num_value];
        return add_list;
    },
    get_mov_one_info: function(num) {
        var mov_list = (!num || num === null) ? this.can_mov_list[this.num_value] : this.can_mov_list[num];
        return mov_list;
    },
    // update (dt) {},

    // 瞎鸡儿移之后还是数字吗
    is_num: function() {
        let sum = 0;
        let check_sum = 7;
        if (this.num_value >= 10) {
            check_sum = 2;
        }
        if (this.self_stick_list[this.num_value]) {
            for (let i = 1; i <= check_sum; i++) {
                let node_name = "node_" + i;
                let pos_val = this.self_stick_list[this.num_value][node_name];
                let curr_node = this.node.getChildByName(node_name);
                let curr_node_sprite = this.get_stick_sprite_node(curr_node);
                if (curr_node_sprite.active === pos_val) {
                    sum++;
                }
            }
        }
        return sum === check_sum;
    },

    get_num_value: function() {
        if (this.is_num() === true) {
            return this.num_value;
        } else {
            return -1;
        }
    },
});