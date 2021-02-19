var fashi_tower_skin = cc.Class({
    name: "fashi_tower_skin",
    properties: {
        tower_anim: {
            default: [],
            type: cc.SpriteFrame
        },

        tower_anim_durataion: 0.1, // 动画间隔

        shoot_up_anim: { // 向上发射的人的动画
            default: [],
            type: cc.SpriteFrame
        },
        up_anim_durataion: 0.1, // 动画间隔

        shoot_down_anim: {
            default: [],
            type: cc.SpriteFrame
        },
        down_anim_durataion: 0.1, // 动画间隔

        xpos: -1,
        ypos: 19,
    }
});

var ugame = require("ugame");
var fashi_tower_params = require("fashi_tower_params");
var delay_set_up = [0.6, 0.6, 0.6, 0.6];
var delay_set_down = [0.5, 0.5, 0.5, 0.5];
var start_pos_up = [cc.v2(6, 6), cc.v2(6, 6), cc.v2(6, 6), cc.v2(6, 6)];
var start_pos_down = [cc.v2(-5, 8), cc.v2(-5, 8), cc.v2(-5, 8), cc.v2(-5, 8)];

cc.Class({
    extends: cc.Component,

    properties: {
        tower_level: 1,
        tower_skin_set: {
            default: [],
            type: fashi_tower_skin
        },

        prefab_fashi_bullet: {
            type: cc.Prefab,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.node.getChildByName("anim");
        this.anim.addComponent("frame_anim");
        this.man = this.node.getChildByName("man");
        this.man.addComponent("frame_anim");

        this.bullet_root = cc.find("UI_ROOT/map_root");

        this._set_tower_idle();
        this._set_man_idle(true);
    },

    start() {
        // this.schedule(function() {
        //     var R = 60;
        //     var r = Math.random() * 2 * Math.PI;
        //     var w_dst_pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        //     w_dst_pos.x += R * Math.cos(r);
        //     w_dst_pos.y += R * Math.sin(r);
        //     this.shoot_at(w_dst_pos);
        // }.bind(this), 3);

        this.scheduleOnce(this.tower_ai.bind(this), 0.1);
    },

    shoot_at: function(w_dst_pos) {
        this._play_tower_anim();
        this._play_shoot_man_anim(w_dst_pos);
    },

    // AI
    tower_ai: function() {
        var center_pos = this.node.getPosition();
        var search_r = fashi_tower_params[this.tower_level - 1].search_r;
        var enemy = ugame.search_enemy(center_pos, search_r);

        var update_time = 0.1; // AI更新时间
        if (enemy) {
            var w_pos = enemy.convertToWorldSpaceAR(cc.v2());
            this.shoot_at(w_pos);

            update_time = 1;
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
        this._set_man_idle();
    },
    // 塔满级判断
    is_full_level: function() {
        return this.tower_level >= this.tower_skin_set.length;
    },
    // 发射子弹
    _shoot_bullet: function(w_dst_pos, b_up) {
        var time, start_pos;
        if (b_up) {
            time = delay_set_up[this.tower_level - 1];
            start_pos = start_pos_up[this.tower_level - 1];
        } else {
            time = delay_set_down[this.tower_level - 1];
            start_pos = start_pos_down[this.tower_level - 1];
        }
        var delay = cc.delayTime(time);
        var func = cc.callFunc(function() {
            var center_pos = this.node.getPosition();
            var search_r = fashi_tower_params[this.tower_level - 1].search_r;
            var enemy = ugame.search_enemy(center_pos, search_r);
            if (enemy) {
                w_dst_pos = enemy.convertToWorldSpaceAR(cc.v2(0, 0));
            }

            var w_start_pos = this.man.convertToWorldSpaceAR(start_pos);
            var fashi_bullet = cc.instantiate(this.prefab_fashi_bullet);
            this.bullet_root.addChild(fashi_bullet);
            fashi_bullet.getComponent("fashi_bullet").shoot_at(w_start_pos, w_dst_pos, enemy);
        }.bind(this));
        var seq = cc.sequence([delay, func]);
        this.node.runAction(seq);
    },
    _play_shoot_man_anim: function(w_dst_pos) {
        var w_start_pos = this.man.convertToWorldSpaceAR(cc.v2(0, 0));
        var frame_anim = this.man.getComponent("frame_anim");

        var b_up = !(w_start_pos.y >= w_dst_pos.y);
        if (!b_up) {
            // 下动画
            frame_anim.sprite_frames = this.tower_skin_set[this.tower_level - 1].shoot_down_anim;
            frame_anim.duration = this.tower_skin_set[this.tower_level - 1].down_anim_durataion;
        } else {
            // 上动画
            frame_anim.sprite_frames = this.tower_skin_set[this.tower_level - 1].shoot_up_anim;
            frame_anim.duration = this.tower_skin_set[this.tower_level - 1].up_anim_durataion;
        }
        frame_anim.play_once(function() {
            this._set_man_idle(b_up);
        }.bind(this));

        this._shoot_bullet(w_dst_pos, b_up);
    },
    _play_tower_anim: function() {
        var frame_anim = this.anim.getComponent("frame_anim");
        frame_anim.sprite_frames = this.tower_skin_set[this.tower_level - 1].tower_anim;
        frame_anim.duration = this.tower_skin_set[this.tower_level - 1].tower_anim_durataion;
        frame_anim.play_once(this._set_tower_idle.bind(this));
    },
    _set_tower_idle: function() {
        var s = this.anim.getComponent(cc.Sprite);
        s.spriteFrame = this.tower_skin_set[this.tower_level - 1].tower_anim[0];
    },
    _set_man_idle: function(b_up) {
        this.man.x = this.tower_skin_set[this.tower_level - 1].xpos;
        this.man.y = this.tower_skin_set[this.tower_level - 1].ypos;

        var s = this.man.getComponent(cc.Sprite);
        if (b_up) {
            s.spriteFrame = this.tower_skin_set[this.tower_level - 1].shoot_up_anim[0];
        } else {
            s.spriteFrame = this.tower_skin_set[this.tower_level - 1].shoot_down_anim[0];
        }
    },
    // update (dt) {},
});