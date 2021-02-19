var fashi_bullet_params = require("fashi_bullet_params");
var ugame = require("ugame");

var fashi_bullet_set = cc.Class({
    name: "fashi_bullet_set",
    properties: {
        butllet_icon: {
            default: null,
            type: cc.SpriteFrame
        },

        bomb_anim: {
            default: [],
            type: cc.SpriteFrame
        },
        bomb_duration: 0.1,
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        bullet_level: 1,
        bullet_skin_set: {
            default: [],
            type: fashi_bullet_set,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.node.getChildByName("anim");
        this.anim.addComponent("frame_anim");
    },

    start() {

    },


    shoot_at: function(w_start_pos, w_dst_pos, enemy) {
        if (!this.node.parent) {
            console.log("shoot_at must add to parent first");
            return;
        }

        this.shoot_enemy = enemy;

        this._set_bullet_idle();

        var fashi_bullet_param = fashi_bullet_params[this.bullet_level - 1];

        var start_pos = this.node.parent.convertToNodeSpaceAR(w_start_pos);
        this.node.setPosition(start_pos);

        var time = w_dst_pos.sub(w_start_pos).mag() / fashi_bullet_param.speed;

        // 为了让子弹打在目标身上，对子弹的攻击位置做处理
        if (this.shoot_enemy != null) {
            var actor = this.shoot_enemy.getComponent("actor");
            var after_pos = actor.position_after_time(time);
            // w_dst_pos = this.shoot_enemy.parent.convertToWorldSpaceAR(after_pos); // 这个代码导致w_dst_pos位置计算错误 先注释掉了
        }
        var dst_pos = this.node.parent.convertToNodeSpaceAR(w_dst_pos);
        var mov = cc.moveTo(time, dst_pos);

        var func = cc.callFunc(function() {
            this.on_bullet_bomb(w_dst_pos);

            var frame_anim_comp = this.anim.getComponent("frame_anim");
            frame_anim_comp.sprite_frames = this.bullet_skin_set[this.bullet_level - 1].bomb_anim;
            frame_anim_comp.duration = this.bullet_skin_set[this.bullet_level - 1].bomb_duration;
            frame_anim_comp.play_once(function() {
                this.node.removeFromParent();
            }.bind(this));
        }.bind(this));

        var seq = cc.sequence([mov, func]);
        this.node.runAction(seq);
    },

    // 子弹爆炸伤害
    on_bullet_bomb: function(w_dst_pos) {
        if (this.shoot_enemy === null) {
            return;
        }
        if (ugame.is_enemy_alive(this.shoot_enemy)) {
            var fashi_bullet_param = fashi_bullet_params[this.bullet_level - 1];
            var actor = this.shoot_enemy.getComponent("actor");
            actor.on_get_attack(fashi_bullet_param.attack);
        }
    },

    _set_bullet_idle: function() {
        var s = this.anim.getComponent(cc.Sprite);
        s.spriteFrame = this.bullet_skin_set[this.bullet_level - 1].butllet_icon;
    },
    // update (dt) {},
});