// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var enum_shape_type = cc.Enum({
    SANJIAO: 0,
    ZHENGFANGXING: 1,
    PINGXINGSHIBIANXING: 2
});
var scene_mgr = require("./scene_manager");
cc.Class({
    extends: cc.Component,

    properties: {
        /**
         * 1 2上 3
         * 4 5中 6
         * 7 8下 9
         */
        lab_index: {
            type: cc.Label,
            default: null
        },
        index: 1,
        piece_type: 0, // 0 use 1 design
        shape_type: {
            type: cc.Enum(enum_shape_type),
            default: enum_shape_type.SANJIAO
        },
        scale_num: {
            type: cc.Float,
            default: 1
        },
        rotate_index: 0
    },

    // LIFE-CYCLE CALLBACKS:

    /**
     * 不规则多边形触摸测试
     * @param {触摸点} point 
     * @param {监听} listener 
     */
    polygonHitTest(point, listener) {
        var polygonCollider = this.node.getComponent(cc.PolygonCollider);
        if (polygonCollider) {
            point = this.node.convertToNodeSpace(point);
            point.x -= this.node.getContentSize().width / 2;
            point.y -= this.node.getContentSize().height / 2;
            return cc.Intersection.pointInPolygon(point, polygonCollider.points);
        } else {
            return this.node._oldHitTest(point, listener);
        }
    },

    onLoad() {
        this.node._oldHitTest = this.node._hitTest.bind(this);
        this.node._hitTest = this.polygonHitTest.bind(this);

        this.check_distance = 30; // 距离检测
        // 三角形8种状态
        var sanjiao_list = [0, -45, -90, -135, -180, 135, 90, 45];
        // 正方形2种状态
        var zhengfangxing_list = [0, 45];
        // 平行四边形4种状态
        var pingxingsibianxing_list = [0, 45, 90, 135];

        this.node_target_design = cc.find("Canvas/ti_content2/node_target_design");

        if (this.shape_type === 0) {
            this.angle_list = sanjiao_list;
        } else if (this.shape_type === 1) {
            this.angle_list = zhengfangxing_list;
        } else if (this.shape_type === 2) {
            this.angle_list = pingxingsibianxing_list;
        }
        this.collider = this.node.getComponent(cc.PolygonCollider);

        var angle_list_length = this.angle_list.length;
        this.angle_to_index_list = [];
        for (var i = 0; i < angle_list_length; i++) {
            this.angle_to_index_list[this.angle_list[i]] = i;
        }

        this.index_equal_list = [];
        this.index_equal_list[1] = 2;
        this.index_equal_list[2] = 1;
        this.index_equal_list[3] = 5;
        this.index_equal_list[5] = 3;

        this.max_index = 10;
        this.start_moving = false;
        if (this.piece_type === 0) {
            this.node.on(cc.Node.EventType.TOUCH_START, function(touch, event) {
                if (this.start_moving || this.is_right_position)
                    return;
                // let touchLoc = touch.getLocation();
                // let new_pos = this.node.convertToNodeSpaceAR(touchLoc);
                // if (cc.Intersection.pointInPolygon(new_pos, this.collider.points)) {
                this.start_moving = true;
                this.lab_index.enabled = false;
                this.node.setSiblingIndex(this.max_index);
                this.max_index++;
                scene_mgr.getInstance().set_current_node(this.node);
                // }
            }.bind(this), this);

            this.node.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
                if (!this.start_moving)
                    return;

                let dela = e.getDelta();
                this.node.x += dela.x;
                this.node.y += dela.y;
            }.bind(this), this);

            this.node.on(cc.Node.EventType.TOUCH_END, function() {
                this.start_moving = false;

                this.is_on_right_position();
            }.bind(this), this);

            this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
                this.start_moving = false;

                this.is_on_right_position();
            }.bind(this), this);
        } else if (this.piece_type === 1) {
            this.node.enabledContactListener = true;
        }
    },

    start() {
        this.is_rotation = false;
        this.is_right_position = false;

        // this.node.rotation = this.angle_list[this.rotate_index];
        var is_negative = this.node.angle < 0;
        if (is_negative === true){
            if((this.node.angle >= -90 && this.node.angle < -89) || (this.node.angle >= -91 && this.node.angle < -90)){
                this.node.angle = -90;
            }
        }
        var rotate = is_negative ? Math.floor(this.node.angle) : Math.ceil(this.node.angle);
        this.target = this.angle_to_index_list[rotate];
        if(CC_DEBUG){
            console.log("===========rotate", this.piece_type, this.index, this.node.angle, rotate, this.target);
        }
    },

    // 朝向和index都相同才相等
    is_same_piece: function(curr_node_comp) {
        let is_same_index = (this.index === curr_node_comp.index || (this.index_equal_list[this.index] && this.index_equal_list[this.index] === curr_node_comp.index))
        let is_same_target = this.target === curr_node_comp.target;
        if (is_same_index && is_same_target) {
            return true;
        }
        return false;
    },
    // 旋转
    rotate_piece: function() {
        if (this.is_rotation) {
            return;
        }
        this.is_rotation = true;
        this.target = this.target + 1;
        if (this.target >= this.angle_list.length) {
            this.target = 0;
        }

        let target_rot = this.angle_list[this.target];
        let finish = cc.callFunc(function() {
            this.is_rotation = false;
        }.bind(this), this);
        this.node.runAction(cc.sequence(cc.rotateTo(0.2, target_rot), finish));
    },

    // 位置检测
    is_on_right_position: function() {
        var my_pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        for (var i = 0; i < this.node_target_design.children.length; i++) {
            if (this.node_target_design.children[i].group === "node_diban") {
                var curr_node = this.node_target_design.children[i];
                var curr_node_comp = curr_node.getComponent("common_piece");

                var new_pos = curr_node.convertToWorldSpaceAR(cc.v2(0, 0));
                var curr_distance = my_pos.sub(new_pos).mag();
                
                if (this.is_same_piece(curr_node_comp) && curr_distance <= this.check_distance) {
                    var my_new_pos = this.node.parent.convertToNodeSpaceAR(new_pos);
                    this.is_right_position = true;
                    this.node.setPosition(my_new_pos);

                    scene_mgr.getInstance().set_current_node(null);
                    scene_mgr.getInstance().play_click_effect();

                    if (curr_node_comp.scale_num !== 1) {
                        this.play_scale_anima(curr_node_comp.scale_num);
                    }
                    break;
                }
            }
        }
    },
    // 播放缩放动画
    play_scale_anima: function(scale_num) {
        this.node.runAction(cc.scaleTo(0.3, scale_num));
    },
    onDisable: function() {
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_MOVE);
        this.node.off(cc.Node.EventType.TOUCH_END);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL);
    }
});