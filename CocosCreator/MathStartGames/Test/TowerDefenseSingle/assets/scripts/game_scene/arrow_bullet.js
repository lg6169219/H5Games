var arrow_bullet_params = require("arrow_bullet_params");
var ugame = require("ugame");

cc.Class({
    extends: cc.Component,

    properties: {
        bullet_level: 1, // 子弹级别
        speed: 200, // 子弹移动的速度
        attack: 10, // 子弹的攻击力
        arrow_sprite_frame: { // 保持的是弓箭图片
            default: null,
            type: cc.SpriteFrame
        },
        decal_arrow_sprite_frame: { // 保持的是半截弓箭图片
            default: null,
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.node.getChildByName("anim");
    },

    start() {

    },

    // 子弹发射 起始和终止位置 世界坐标（确保子弹加入子弹的root）
    shoot_at: function(w_start_pos, w_dst_pos, enemy) {
        if (!this.node.parent) {
            console.log("shoot_at must add to parent first");
            return;
        }

        this.bullet_params = arrow_bullet_params[this.bullet_level - 1];

        this.shoot_enemy = enemy;

        var start_pos = this.node.parent.convertToNodeSpaceAR(w_start_pos);

        this.node.setPosition(start_pos);
        this.anim.angle = -90;

        // ***** 建贝塞尔action来控制子弹发射
        var dir = w_dst_pos.sub(w_start_pos); // 获得方向向量 终点-起点
        var len = dir.mag();
        var time = len / this.bullet_params.speed; // 贝塞尔曲线运行时间

        // 为了让子弹打在目标身上，对子弹的攻击位置做处理
        if (this.shoot_enemy != null) {
            var actor = this.shoot_enemy.getComponent("actor");
            var after_pos = actor.position_after_time(time);
            w_dst_pos = this.shoot_enemy.parent.convertToWorldSpaceAR(after_pos);
        }
        var dst_pos = this.node.parent.convertToNodeSpaceAR(w_dst_pos);
        // 求贝塞尔曲线的控制点，中点，然后再拉高xxx
        var ctrl_x;
        var ctrl_y;

        ctrl_x = (start_pos.x + dst_pos.x) * 0.5;
        ctrl_y = (dst_pos.y > start_pos.y) ? dst_pos.y : start_pos.y;
        ctrl_y += 40;

        var bezier = [cc.v2(ctrl_x, ctrl_y), cc.v2(ctrl_x, ctrl_y), dst_pos];
        var bezier_to = cc.bezierTo(time, bezier);
        var call_func = cc.callFunc(function() {
            var s = this.anim.getComponent(cc.Sprite);
            s.spriteFrame = this.decal_arrow_sprite_frame;

            // 伤害判定
            this.on_bullet_bomb();
        }, this);

        var end_func = cc.callFunc(function() {
            this.node.removeFromParent();
        }, this);
        var seq = cc.sequence([bezier_to, call_func, cc.delayTime(2), cc.fadeOut(0.3), end_func]);
        this.node.runAction(seq); // 发射到目标点

        var rotation_val = -180;
        var offset_angle = Math.random() * 15;
        if (w_dst_pos.x < w_start_pos.x) {
            rotation_val = 180;
            rotation_val -= offset_angle;
        } else {
            rotation_val += offset_angle;
        }
        var rotate_to = cc.rotateBy(time, rotation_val);
        this.anim.runAction(rotate_to);
    },

    // 子弹爆炸伤害
    on_bullet_bomb: function() {
        if (this.shoot_enemy === null) {
            return;
        }
        if (ugame.is_enemy_alive(this.shoot_enemy)) {
            var actor = this.shoot_enemy.getComponent("actor");
            actor.on_get_attack(this.bullet_params.attack);

            // 删掉 就不会执行后面的渐隐消失action了
            this.node.removeFromParent();
        }
    },
});