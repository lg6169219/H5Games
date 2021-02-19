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
var sound_mgr = require("../sound_manager");
var global_var = require("../global_var");
cc.Class({
    extends: cc.Component,

    properties: {
        text_title: {
            default: null,
            type: cc.Label
        },
        text_content: {
            default: null,
            type: cc.Label
        },
        node_content2: {
            default: null,
            type: cc.Node
        },
        btn_tijiao: {
            default: null,
            type: cc.Node
        },
        node_win: {
            default: null,
            type: cc.Node
        },
        node_lose: {
            default: null,
            type: cc.Node
        },

        node_duti: {
            default: null,
            type: cc.Node
        },

        audio_ti: {
            default: null,
            type: cc.AudioClip
        },

        btn_reset: {
            default: null,
            type: cc.Node
        },

        btn_rotate: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        if (CC_DEBUG) {
            cc.director.getCollisionManager().enabledDebugDraw = true;
        }
        this.curr_index = scene_mgr.getInstance().curr_index;
        // let list_info = global_var.list[this.title_index - 1];

        this.text_content.string = "为了对付犀牛上校，小伙伴又想出了新的难题：在三角形的基础上再增加2根火柴变成2个三角形，小朋友，你知道怎么做吗？";

        let chn_num_char = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "11", "12", "13"];
        this.text_title.string = "第" + chn_num_char[this.curr_index + 1] + "题";

        // 读题
        this.node_duti.on(cc.Node.EventType.TOUCH_END, function() {
            sound_mgr.getInstance().play_effect(this.audio_ti, false);
        }.bind(this), this);

        // 提交
        this.btn_tijiao.on(cc.Node.EventType.TOUCH_END, function() {
            this.submitAnswer();
        }.bind(this), this);

        this.btn_reset.on(cc.Node.EventType.TOUCH_START, function() {
            var scene = cc.director.getScene();
            cc.director.loadScene(scene.name);
        }.bind(this), this);

        this.selectedStick = null;

        function triSelectStick(t) {
            this.selectedStick = t.target;
        };

        function triMoveStick(t) {
            if (this.selectedStick != null) {
                var delta = t.getDelta();
                this.selectedStick.x += delta.x;
                this.selectedStick.y += delta.y;
            }
        };

        function triMoveStickEnd(t) {
            if (this.selectedStick != null) {
                this.is_in_right_pos();
            }
        };

        function triRotClick(event, customEventData) {
            if (this.selectedStick != null) {
                this.selectedStick.angle += 30;
                this.selectedStick.angle = this.selectedStick.angle % 360;
            }
        };


        this.selectedStick = null;
        this.node_drag_1 = this.node_content2.getChildByName("node_drag_1");
        this.node_drag_1.on(cc.Node.EventType.TOUCH_START, triSelectStick.bind(this), this);
        this.node_drag_1.on(cc.Node.EventType.TOUCH_MOVE, triMoveStick.bind(this), this);
        this.node_drag_1.on(cc.Node.EventType.TOUCH_CANCEL, triMoveStickEnd.bind(this), this);
        this.node_drag_1.on(cc.Node.EventType.TOUCH_END, triMoveStickEnd.bind(this), this);

        this.node_drag_2 = this.node_content2.getChildByName("node_drag_2");
        this.node_drag_2.on(cc.Node.EventType.TOUCH_START, triSelectStick.bind(this), this);
        this.node_drag_2.on(cc.Node.EventType.TOUCH_MOVE, triMoveStick.bind(this), this);
        this.node_drag_2.on(cc.Node.EventType.TOUCH_CANCEL, triMoveStickEnd.bind(this), this);
        this.node_drag_2.on(cc.Node.EventType.TOUCH_END, triMoveStickEnd.bind(this), this);

        this.btn_rotate.on(cc.Node.EventType.TOUCH_START, triRotClick.bind(this), this);
    },
    is_in_right_pos: function() {
        // 横 90 270 斜 150 330  / 30  210
        let w_pos = this.selectedStick.convertToWorldSpaceAR(cc.v2(0, 0));
        // 位置吸附
        if (this.selectedStick.angle == 90 || this.selectedStick.angle == 270) {
            let is_collider = false;
            let check_node_name = "node_1";
            let check_node = this.node_succ.getChildByName(check_node_name);
            let check_node_collider = check_node.getComponent(cc.PolygonCollider);
            if (cc.Intersection.pointInPolygon(w_pos, check_node_collider.world.points)) {
                let check_node_w_pos = check_node.convertToWorldSpaceAR(cc.v2(0, 0));
                let node_pos = this.selectedStick.parent.convertToNodeSpaceAR(check_node_w_pos);
                this.selectedStick.setPosition(node_pos);
                is_collider = true;
            }

            if (is_collider === false) {
                let check_node_name = "node_3";
                let check_node = this.node_succ.getChildByName(check_node_name);
                let check_node_collider = check_node.getComponent(cc.PolygonCollider);
                if (cc.Intersection.pointInPolygon(w_pos, check_node_collider.world.points)) {
                    let check_node_w_pos = check_node.convertToWorldSpaceAR(cc.v2(0, 0));
                    let node_pos = this.selectedStick.parent.convertToNodeSpaceAR(check_node_w_pos);
                    this.selectedStick.setPosition(node_pos);
                }
            }
        }

        if (this.selectedStick.angle == 150 || this.selectedStick.angle == 330) {
            let check_node_name = "node_4";
            let check_node = this.node_succ.getChildByName(check_node_name);
            let check_node_collider = check_node.getComponent(cc.PolygonCollider);
            if (cc.Intersection.pointInPolygon(w_pos, check_node_collider.world.points)) {
                let check_node_w_pos = check_node.convertToWorldSpaceAR(cc.v2(0, 0));
                let node_pos = this.selectedStick.parent.convertToNodeSpaceAR(check_node_w_pos);
                this.selectedStick.setPosition(node_pos);
            }
        }

        if (this.selectedStick.angle == 30 || this.selectedStick.angle == 210) {
            let check_node_name = "node_2";
            let check_node = this.node_succ.getChildByName(check_node_name);
            let check_node_collider = check_node.getComponent(cc.PolygonCollider);
            if (cc.Intersection.pointInPolygon(w_pos, check_node_collider.world.points)) {
                let check_node_w_pos = check_node.convertToWorldSpaceAR(cc.v2(0, 0));
                let node_pos = this.selectedStick.parent.convertToNodeSpaceAR(check_node_w_pos);
                this.selectedStick.setPosition(node_pos);
            }
        }
    },
    // 提交答案
    submitAnswer() {
        if (this.is_over) {
            return;
        }
        this.is_over = true;

        this.is_win = this.get_result();
        var res = scene_mgr.getInstance().submitAnswer(this.curr_index, this.is_win);

        let has_next = global_var.list[this.curr_index + 1];

        var use_node = null;
        if (res === true) {
            this.node_win.active = true;
            this.node_lose.active = false;
            use_node = this.node_win;
        } else {
            this.node_win.active = false;
            this.node_lose.active = true;
            use_node = this.node_lose;
        }

        if (use_node && use_node != null) {
            var audio = use_node.getComponent(cc.AudioSource);
            audio.play();
            use_node.scale = 0;
            var s = cc.scaleTo(0.4, 1).easing(cc.easeBackOut());
            use_node.runAction(s);

            var node_next = use_node.getChildByName("node_next");
            var node_final = use_node.getChildByName("node_final");
            var node_mash = use_node.getChildByName("New Sprite(Splash)");
            node_mash.on(cc.Node.EventType.TOUCH_START, function() {

            }.bind(this), this);

            if (has_next) {
                node_next.active = true;
                node_final.active = false;

                var node_btn = node_next.getChildByName("button");
                node_btn.on(cc.Node.EventType.TOUCH_START, this.gotoNextTitle, this);
            } else {
                node_next.active = false;
                node_final.active = true;

                var btn_restart = node_final.getChildByName("btn_restart");
                var btn_done = node_final.getChildByName("btn_done");
                btn_restart.on(cc.Node.EventType.TOUCH_START, this.replay, this);
                btn_done.on(cc.Node.EventType.TOUCH_END, function() {
                    scene_mgr.getInstance().sendResAnswer();
                }, this);
            }
        }
    },
    // 下一题
    gotoNextTitle() {
        scene_mgr.getInstance().gotoNextTitle();
    },
    replay() {
        scene_mgr.getInstance().replay();
    },
    start() {
        this.node_succ = this.node_content2.getChildByName("node_succ");
    },
    onDestroy() {
        this.selectedStick = null;
        this.node_duti.off(cc.Node.EventType.TOUCH_END);
        this.btn_tijiao.off(cc.Node.EventType.TOUCH_END);
    },
    // update (dt) {},
    change_num: function(curr_node, to_val, deltiems) {
        if (deltiems === true) {
            this.can_use_times--;
        }

        let node = this.node.getChildByName("node_all_nums");
        let common_all_nums = node.getComponent("common_all_nums");
        if (CC_DEBUG) {
            console.log("============common_all_nums.num_prefabs", common_all_nums.num_prefabs, to_val, curr_node.name);
        }
        let new_node = cc.instantiate(common_all_nums.num_prefabs[to_val]);
        new_node.scale = curr_node.scale;
        this.node_content2.addChild(new_node, curr_node.zIndex, curr_node.name);
        new_node.setPosition(curr_node.getPosition());
        curr_node.removeFromParent();
    },
    get_result: function() {
        let node_drag_1_collider = this.node_drag_1.getComponent(cc.PolygonCollider);
        let node_drag_2_collider = this.node_drag_2.getComponent(cc.PolygonCollider);

        // 不知道怎么检测碰撞面积 所以用点替代 如果node_drag有至少3个点在node_succ 1~4中，就算拖拽成功
        let first_index = -1;
        for (let i = 1; i <= 4; i++) {
            let check_node_name = "node_" + i;
            let check_node = this.node_succ.getChildByName(check_node_name);
            let check_node_collider = check_node.getComponent(cc.PolygonCollider);

            let sum = 0;
            for (let j = 0; j < node_drag_1_collider.points.length; j++) {
                let point = node_drag_1_collider.world.points[j];
                if (cc.Intersection.pointInPolygon(point, check_node_collider.world.points)) {
                    sum++;
                }
            }
            if (sum >= 3) {
                first_index = i;
                break;
            }
        }
        let check_index_list = {
            1: "node_2",
            2: "node_1",
            3: "node_4",
            4: "node_3"
        }

        let second_index = -1;
        if (first_index !== -1) {
            let check_node_name = check_index_list[first_index];
            if (check_node_name) {
                let check_node = this.node_succ.getChildByName(check_node_name);
                let check_node_collider = check_node.getComponent(cc.PolygonCollider);

                let sum = 0;
                for (let j = 0; j < node_drag_2_collider.points.length; j++) {
                    let point = node_drag_2_collider.world.points[j];
                    if (cc.Intersection.pointInPolygon(point, check_node_collider.world.points)) {
                        sum++;
                    }
                }

                if (sum >= 3) {
                    second_index = 0;
                }
            }
        }
        let is_win = false;
        if (first_index !== -1 && second_index !== -1) {
            is_win = true;
        }
        return is_win;
    },
});