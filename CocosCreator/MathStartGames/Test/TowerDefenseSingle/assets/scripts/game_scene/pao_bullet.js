var pao_bullet_skin = cc.Class({
    name: "bullet_skin",
    properties: {
        bullet_icon: {
            type: cc.SpriteFrame,
            default: null
        },

        bomb_anim_frames: {
            type: cc.SpriteFrame,
            default: []
        },

        duration: 0.08, // 动画帧间隔
    }
});

var pao_bullet_params = require("pao_bullet_params");
var ugame = require("ugame");
cc.Class({
    extends: cc.Component,

    properties: {
        bullet_level: 1, // 子弹级别
        attack: 10, // 子弹的攻击力
        bullet_skin_res: {
            default: [],
            type: pao_bullet_skin
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.node.getChildByName("anim");
        this.anim_comp = this.anim.getComponent(cc.Sprite);
    },

    start() {},

    // 子弹发射 起始和终止位置 世界坐标（确保子弹加入子弹的root）
    shoot_at: function(w_start_pos, w_dst_pos, enemy) {
        if (!this.node.parent) {
            console.log("shoot_at must add to parent first");
            return;
        }
        this._set_bullet_idle();

        this.shoot_enemy = enemy;

        this.bullet_params = pao_bullet_params[this.bullet_level - 1];

        var start_pos = this.node.parent.convertToNodeSpaceAR(w_start_pos);

        // 初始化位置和旋转
        this.node.setPosition(start_pos);
        this.node.angle = 0;

        // ***** 建贝塞尔action来控制子弹发射 
        var dir = w_dst_pos.sub(w_start_pos);
        var len = dir.mag();
        var time = len / this.bullet_params.speed;

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
        ctrl_y = (dst_pos.y < start_pos.y) ? dst_pos.y : start_pos.y;
        ctrl_y += 40;

        var bezier = [cc.v2(ctrl_x, ctrl_y), cc.v2(ctrl_x, ctrl_y), dst_pos];
        var bezier_to = cc.bezierTo(time, bezier);

        // 爆炸动画
        var end_func = cc.callFunc(function() {
            this.on_bullet_bomb();
            this.play_bullet_bomb_anim();
        }, this);
        var seq = cc.sequence([bezier_to, end_func]);
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

    // 爆炸动画
    play_bullet_bomb_anim: function() {
        this.anim.angle = 0;
        var frame_comp = this.anim.getComponent("frame_anim");
        frame_comp.sprite_frames = this.bullet_skin_res[this.bullet_level - 1].bomb_anim_frames;
        frame_comp.duration = this.bullet_skin_res[this.bullet_level - 1].duration;
        frame_comp.play_once(function() {
            this.node.removeFromParent();
        }.bind(this));
    },
    // 子弹造成伤害的处理 w_dst_pos爆炸位置
    on_bullet_bomb: function() {
        var bomb_r = this.bullet_params.bomb_r;
        var bomb_pos = this.node.getPosition();

        var enemy_set = ugame.get_enemy_set();
        for (var i = 0; i < enemy_set.length; i++) {
            var pos = enemy_set[i].getPosition();
            var len = pos.sub(bomb_pos).mag();
            if (len <= bomb_r) {
                enemy_set[i].getComponent("actor").on_get_attack(this.bullet_params.attack);
            }
        }
    },

    _set_bullet_idle: function() {
        this.anim_comp.spriteFrame = this.bullet_skin_res[this.bullet_level - 1].bullet_icon;
    },
    // update (dt) {},
});