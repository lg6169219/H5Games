var pao_tower_skin = cc.Class({
    name: "pao_tower_skin",
    properties: {
        shoot_anim: {
            default: [],
            type: cc.SpriteFrame
        },
        shoot_anim_duration: 0.1,
        shoot_bullet: { // 填弹子弹资源
            default: [],
            type: cc.SpriteFrame
        }
    },
});

var pao_tower_params = require("pao_tower_params");
var ugame = require("ugame");

var start_pos_set = [cc.v2(-24, 2), cc.v2(-24, 3), cc.v2(-24, 2), cc.v2(-24, 2)]; // 装填子弹动画起始位置
var end_pos_set = [cc.v2(3, 20), cc.v2(3, 21), cc.v2(3, 24), cc.v2(3, 24)];
var delay_time_set = [0.8, 1.5, 1.1]; // 装填子弹延迟秒
var rot_degree_set = [180 + Math.random() * 90, 180 + Math.random() * 90, 45];

var bullet_shoot_delay_time_set = [0.7, 0.8, 0.6, 1.4, 3.5]; // 子弹发射延迟
var bullet_shoot_start_pos_set = [cc.v2(3, 16), cc.v2(3, 16), cc.v2(3, 16), cc.v2(-1, 20), cc.v2(-22, 24)]; // 子弹发射起始位置

cc.Class({
    extends: cc.Component,

    properties: {
        tower_level: 1, // 塔的级别

        tower_skin_set: {
            default: [],
            type: pao_tower_skin
        },

        bullet_prefab: {
            type: cc.Prefab,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.node.getChildByName("anim");
        this.bullet_icon = this.anim.getChildByName("bullet_icon");
        this.bullet_icon.scale = 0; // 为了避免active=false状态下时间不更新的问题

        this.bullet_root = cc.find("UI_ROOT/map_root");
        this._set_tower_idle();
    },

    start() {
        this.scheduleOnce(this.tower_ai.bind(this), 0.1);
    },

    shoot_at: function(w_dst_pos) {
        var frame_anim = this.anim.getComponent("frame_anim");
        frame_anim.sprite_frames = this.tower_skin_set[this.tower_level - 1].shoot_anim;
        frame_anim.duration = this.tower_skin_set[this.tower_level - 1].shoot_anim_duration;
        frame_anim.play_once(this._set_tower_idle.bind(this));

        this._play_preload_bullet_anim();
        this._shoot_bullet(w_dst_pos, this.tower_level);

        if (this.tower_level === 4) {
            this._shoot_bullet(w_dst_pos, this.tower_level + 1);
        }
    },

    // AI
    tower_ai: function() {
        var center_pos = this.node.getPosition();
        var search_r = pao_tower_params[this.tower_level - 1].search_r;
        var enemy = ugame.search_enemy(center_pos, search_r);

        var update_time = 0.1; // AI更新时间
        if (enemy) {
            var w_pos = enemy.convertToWorldSpaceAR(cc.v2());
            this.shoot_at(w_pos);

            update_time = 1.5;
            if (this.tower_level === 4) {
                update_time = 3.5;
            }
        }
        this.scheduleOnce(this.tower_ai.bind(this), update_time);
    },
    // 升级塔
    upgrade_tower: function() {
        if (this.tower_level >= this.tower_skin_set.length) {
            return;
        }
        this.tower_level++;
        this._set_tower_idle();
    },
    // 塔满级判断
    is_full_level: function() {
        return this.tower_level >= this.tower_skin_set.length;
    },
    _set_tower_idle: function() {
        var s = this.anim.getComponent(cc.Sprite);
        s.spriteFrame = this.tower_skin_set[this.tower_level - 1].shoot_anim[0];
    },

    // 通过图片找到第X帧需要开始播放填弹动画了
    _play_preload_bullet_anim: function() {
        if (this.tower_level === 4) {
            return;
        }
        this.bullet_icon.getComponent(cc.Sprite).spriteFrame =
            this.tower_skin_set[this.tower_level - 1].shoot_bullet[0];

        var delay = cc.delayTime(delay_time_set[this.tower_level - 1]);

        var func = cc.callFunc(function() {
            this.bullet_icon.scale = 1;
            this.bullet_icon.x = start_pos_set[this.tower_level - 1].x;
            this.bullet_icon.y = start_pos_set[this.tower_level - 1].y;
            this.bullet_icon.angle = -45;

            var rot = cc.rotateBy(0.4, rot_degree_set[this.tower_level - 1]);
            this.bullet_icon.runAction(rot);
        }.bind(this));

        var bezier_ctrl_pos = cc.v2((start_pos_set[this.tower_level - 1].x + end_pos_set[this.tower_level - 1].x) * 0.5, end_pos_set[this.tower_level - 1].y + 10);
        var bezier_array = [bezier_ctrl_pos, bezier_ctrl_pos, end_pos_set[this.tower_level - 1]];
        var bezier_to = cc.bezierTo(0.4, bezier_array);

        var scale_to = cc.scaleTo(0.1, 0);

        var seq = cc.sequence([delay, func, bezier_to, scale_to]);
        this.bullet_icon.runAction(seq);
    },
    // 发射子弹
    _shoot_bullet: function(w_dst_pos, bullet_level) {
        var delay_time = bullet_shoot_delay_time_set[bullet_level - 1];
        var start_pos = bullet_shoot_start_pos_set[bullet_level - 1];
        var w_start_pos = this.anim.convertToWorldSpaceAR(start_pos);

        var func = cc.callFunc(function() {
            var center_pos = this.node.getPosition();
            var search_r = pao_tower_params[this.tower_level - 1].search_r;
            var enemy = ugame.search_enemy(center_pos, search_r);
            if (enemy) {
                w_dst_pos = enemy.convertToWorldSpaceAR(cc.v2(0, 0));
            }

            // 发射子弹
            var bullet = cc.instantiate(this.bullet_prefab);
            this.bullet_root.addChild(bullet);

            var pao_bullet = bullet.getComponent("pao_bullet");
            pao_bullet.bullet_level = bullet_level;
            pao_bullet.shoot_at(w_start_pos, w_dst_pos, enemy);
        }.bind(this));
        var seq = cc.sequence([cc.delayTime(delay_time), func]);
        this.node.runAction(seq);
    },
    // update (dt) {},

});