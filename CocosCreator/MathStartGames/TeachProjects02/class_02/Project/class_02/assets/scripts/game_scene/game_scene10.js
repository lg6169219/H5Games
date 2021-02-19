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

        this.text_content.string = "犀牛上校拿出了很多能量木棍，准备教训一下陆地学院的学生们，小朋友，这些木棍能拼成2个正方形吗？";

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

        this.max_index = 10;

        function triSelectStick(t) {
            this.selectedStick = t.target;
            this.selectedStick.setSiblingIndex(this.max_index);
            this.max_index++;
        };

        function triMoveStick(t) {
            if (this.selectedStick != null) {
                var delta = t.getDelta();
                this.selectedStick.x += delta.x;
                this.selectedStick.y += delta.y;
            }
        };

        function triMoveStickEnd(t) {
            // if (this.selectedStick != null) {
            //     let w_pos = this.selectedStick.convertToWorldSpaceAR(cc.v2(0, 0));
            //     let is_in_design = this.check_in_design(w_pos);
            //     if (is_in_design === true && this.tut_times < 2) {
            //         this.tut_times++;
            //         if (this.tut_times === 1) {
            //             var timeCallback = function() {
            //                 this.play_tut_anima();
            //             }
            //             this.scheduleOnce(timeCallback, 0.2);
            //         }
            //         let node_design_w_pos = this.node_design.getChildByName("node_" + this.tut_times).convertToWorldSpaceAR(cc.v2(0, 0));
            //         let new_pos = this.selectedStick.parent.convertToNodeSpaceAR(node_design_w_pos);
            //         this.selectedStick.setPosition(new_pos);

            //         // 移除两个引导的移动监听
            //         this.selectedStick.off(cc.Node.EventType.TOUCH_START, triSelectStick, this);
            //         this.selectedStick.off(cc.Node.EventType.TOUCH_MOVE, triMoveStick, this);
            //         this.selectedStick.off(cc.Node.EventType.TOUCH_END, triMoveStickEnd, this);
            //         this.selectedStick = null
            //     } else {
            //         this.check_trick_pos(w_pos);
            //     }
            // }
        };

        function triRotClick() {
            if (this.selectedStick != null) {
                this.selectedStick.angle += 90;
                this.selectedStick.angle = this.selectedStick.angle % 360;
            }
        };

        this.node_drags = this.node_content2.getChildByName("node_drags");
        for (let i = 1; i <= 7; i++) {
            let drag_name = "node_drag_" + i;
            let drag_node = this.node_drags.getChildByName(drag_name);
            drag_node.on(cc.Node.EventType.TOUCH_START, triSelectStick, this);
            drag_node.on(cc.Node.EventType.TOUCH_MOVE, triMoveStick, this);
            drag_node.on(cc.Node.EventType.TOUCH_END, triMoveStickEnd, this);
        }

        this.btn_rotate.on(cc.Node.EventType.TOUCH_START, triRotClick, this);

        this.tut_times = 0;
        this.node_design = this.node_content2.getChildByName("node_design");
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
        this.play_tut_anima();
    },
    // 引导动画
    play_tut_anima: function() {
        let img_tut = this.node_content2.getChildByName("img_tut");
        img_tut.active = true;
        this.start_tut_x = img_tut.x;
        this.start_tut_y = img_tut.y;
        let mv = cc.moveTo(0.5, this.node_design.getPosition());
        mv.easing(cc.easeInOut(2));
        var fi = cc.fadeIn(0.1);
        var finish = cc.callFunc(function() {
            img_tut.setPosition(this.start_tut_x, this.start_tut_y);
            img_tut.active = false;
        }.bind(this), this);
        img_tut.runAction(cc.sequence(mv, fi, finish));
    },
    onDestroy() {
        this.selectedStick = null;
        this.node_duti.off(cc.Node.EventType.TOUCH_END);
        this.btn_tijiao.off(cc.Node.EventType.TOUCH_END);
    },

    check_trick_pos: function(w_pos) {
        function getInt(val) {
            return val > 0 ? Math.ceil(val) : Math.floor(val);
        }
        for (let i = 3; i <= 10; i++) {
            let node_design_name = "node_" + i;
            let node_design = this.node_design.getChildByName(node_design_name);
            let node_design_w_pos = node_design.convertToWorldSpaceAR(cc.v2(0, 0));
            let node_design_collider = node_design.getComponent(cc.PolygonCollider);

            if (cc.Intersection.pointInPolygon(w_pos, node_design_collider.world.points) && getInt(node_design.angle) === getInt(this.selectedStick.angle % 180)) {
                let new_pos = this.selectedStick.parent.convertToNodeSpaceAR(node_design_w_pos);
                this.selectedStick.setPosition(new_pos);
            }
        }
    },
    // update (dt) {},
    check_in_design: function(w_pos) {
        let node_design_world_pos = this.node_design.convertToWorldSpaceAR(cc.v2(0, 0));
        var rect = new cc.Rect(node_design_world_pos.x - this.node_design.width / 2, node_design_world_pos.y - this.node_design.height / 2, this.node_design.width, this.node_design.height);
        if (rect.contains(w_pos)) {
            return true;
        }
        return false;
    },
    get_result: function() {
        function getInt(val) {
            return val > 0 ? Math.ceil(val) : Math.floor(val);
        }
        // 1. 检查7根木棍 4横 3竖
        // 2. 相邻横棍和相邻竖棍的距离都大于0.75棍长，小于1.5棍长
        // 3. 每个横棍都和2个竖棍相交，每个竖棍

        let is_step1_right = false;
        let heng_num = 0;
        let shu_num = 0;
        let heng_list = [];
        let shu_list = [];
        for (let j = 1; j <= 7; j++) {
            let child_name = "node_drag_" + j;
            let node_child = this.node_drags.getChildByName(child_name);
            if (node_child) {
                if (getInt(node_child.angle % 180) === 0) { // 竖
                    shu_num++;
                    shu_list.push(node_child);
                } else if (getInt(node_child.angle % 180) === 90) {
                    heng_num++;
                    heng_list.push(node_child);
                }
            }
        }
        is_step1_right = (shu_num === 3 && heng_num === 4);

        let is_step2_right = false;
        let dis_min = 190;
        let dis_max = 310;
        let collid_sum = 0;
        let shu_dis_check = false;
        let heng_dis_check = 0;

        for (let i = 0; i < shu_list.length; i++) {
            // 找到1个和四根横棍相交  2个和2根横棍相交
            let shu_node = shu_list[i];
            let shu_node_collider = shu_node.getComponent(cc.PolygonCollider);
            let collid_num = 0;
            let first_heng = null;
            let second_heng = null;
            for (let j = 0; j < heng_list.length; j++) {
                let heng_node = heng_list[j];
                let heng_node_collider = heng_node.getComponent(cc.PolygonCollider);

                if (cc.Intersection.polygonPolygon(shu_node_collider.world.points, heng_node_collider.world.points)) {
                    collid_num++;
                    if (collid_num === 1) {
                        first_heng = heng_node;
                    } else if (collid_num === 2) {
                        second_heng = heng_node;
                    }
                }
            }
            if (collid_num === 2) {
                collid_sum = collid_sum + collid_num;

                if (first_heng && second_heng) {
                    let tmp_dis_vec = second_heng.getPosition().sub(first_heng.getPosition());
                    let dis = tmp_dis_vec.mag();
                    if (dis >= dis_min && dis <= dis_max) {
                        heng_dis_check++;
                    }
                }
            } else if (collid_num === 4) {
                collid_sum = collid_sum + collid_num;
                // 检查3根木棍的距离
                let dis_check_sum = 0;
                for (let tmp_i = 0; tmp_i < shu_list.length; tmp_i++) {
                    let tmp_shu_node = shu_list[tmp_i];
                    if (tmp_i !== i) {
                        let tmp_dis_vec = shu_node.getPosition().sub(tmp_shu_node.getPosition());
                        let dis = tmp_dis_vec.mag();
                        if (dis >= dis_min && dis <= dis_max) {
                            dis_check_sum++;
                        }
                    }
                }
                if (dis_check_sum === 2) {
                    shu_dis_check = true;
                }
            }
        }
        is_step2_right = (collid_sum === 8 && shu_dis_check === true && heng_dis_check === 2);
        return (is_step1_right === true && is_step2_right === true);
    },
});