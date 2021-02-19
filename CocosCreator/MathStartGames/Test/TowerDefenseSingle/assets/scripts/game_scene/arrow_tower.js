var arrow_tower_params = require("arrow_tower_params");
var ugame = require("ugame");

var arrow_tower_skin = cc.Class({
    name: "arrow_tower_skin",
    properties: {
        tower_bg: {
            type: cc.SpriteFrame,
            default: null
        },
        up_idle: {
            type: cc.SpriteFrame,
            default: null
        },
        down_idle: {
            type: cc.SpriteFrame,
            default: null
        },
        up_anim: {
            type: cc.SpriteFrame,
            default: []
        },
        down_anim: {
            type: cc.SpriteFrame,
            default: []
        },
        ypos: 0, // 对于美术出图不规范的图片代码做位置微调 默认16
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        tower_level: 1, // 塔的级别
        level_tower_skin_res: {
            default: [],
            type: arrow_tower_skin,
        },
        anim_duration: 0.1, // 动画时间播放间隔

        arrow_bullet_prefab: { // 子弹预制体对象
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cur_anchor_index = 0; // 弓箭手发射索引
        this.lhs = this.node.getChildByName("lhs");
        this.rhs = this.node.getChildByName("rhs");

        this.bullet_root = cc.find("UI_ROOT/map_root");

        this._set_tower_skin_by_level();
    },

    start() {
        this.scheduleOnce(this.tower_ai.bind(this), 0.1);
    },

    shoot_at: function(w_dst_pos) {
        // 交叉两个弓箭手发射 0 lhs 1 rhs
        if (this.cur_anchor_index === 0) {
            this._shoot_anim_at(this.lhs, w_dst_pos);
        } else {
            this._shoot_anim_at(this.rhs, w_dst_pos);
        }
        this.cur_anchor_index++;
        if (this.cur_anchor_index > 1) {
            this.cur_anchor_index = 0;
        }
    },

    // AI
    tower_ai: function() {
        var center_pos = this.node.getPosition();
        var search_r = arrow_tower_params[this.tower_level - 1].search_r;
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
        if (this.tower_level >= this.level_tower_skin_res.length) {
            return;
        }
        this.tower_level++;
        this._set_tower_skin_by_level();
    },
    // 塔满级判断
    is_full_level: function() {
        return this.tower_level >= this.level_tower_skin_res.length;
    },
    // dir 为0 表示弓箭手向上idle 否则为向下
    _set_anim_idle: function(man, dir) {
        var s = man.getComponent(cc.Sprite);
        if (dir === 0) {
            s.spriteFrame = this.level_tower_skin_res[this.tower_level - 1].up_idle;
        } else {
            s.spriteFrame = this.level_tower_skin_res[this.tower_level - 1].down_idle;
        }
    },
    _set_tower_skin_by_level: function() {
        var y_pos = this.level_tower_skin_res[this.tower_level - 1].ypos;
        if (y_pos === 0) {
            y_pos = 16;
        }
        this.lhs.y = y_pos;
        this.rhs.y = y_pos;

        var s = this.node.getComponent(cc.Sprite);
        s.spriteFrame = this.level_tower_skin_res[this.tower_level - 1].tower_bg;
        if (Math.random() < 0.5) {
            this._set_anim_idle(this.lhs, 0);
            this._set_anim_idle(this.rhs, 0);
        } else {
            this._set_anim_idle(this.lhs, 1);
            this._set_anim_idle(this.rhs, 1);
        }
    },
    // w_dst_pos 目标的世界坐标，man是哪个弓箭手播放射箭动画
    _shoot_anim_at: function(man, w_dst_pos) {
        var f_anim = man.getComponent("frame_anim");
        if (!f_anim) {
            f_anim = man.addComponent("frame_anim");
        }

        var w_pos = man.convertToWorldSpaceAR(cc.v2(0, 0));

        var center_pos = this.node.getPosition();
        var search_r = arrow_tower_params[this.tower_level - 1].search_r;
        var enemy = ugame.search_enemy(center_pos, search_r);
        if (enemy) {
            w_dst_pos = enemy.convertToWorldSpaceAR(cc.v2(0, 0));
        }

        var dir = w_dst_pos.sub(w_pos);

        // 判断射箭是上还是下
        if (dir.y > 0) { // 上
            f_anim.sprite_frames = this.level_tower_skin_res[this.tower_level - 1].up_anim;
            f_anim.duration = this.anim_duration;
            f_anim.play_once(function() {
                this._set_anim_idle(man, 0);
            }.bind(this));
        } else {
            f_anim.sprite_frames = this.level_tower_skin_res[this.tower_level - 1].down_anim;
            f_anim.duration = this.anim_duration;
            f_anim.play_once(function() {
                this._set_anim_idle(man, 1);
            }.bind(this));
        }

        // 生成子弹 发射到目标点
        var arrow_bullet = cc.instantiate(this.arrow_bullet_prefab)
        this.bullet_root.addChild(arrow_bullet);

        // // test
        // var R = 60;
        // var test_x = w_pos.x;
        // var test_y = w_pos.y;
        // var r = Math.random() * 2 * Math.PI;
        // var new_test_x = test_x + R * Math.cos(r);
        // var new_test_y = test_y + R * Math.sin(r);

        var arrow_bullet_comp = arrow_bullet.getComponent("arrow_bullet");
        arrow_bullet_comp.bullet_level = this.tower_level;
        arrow_bullet_comp.shoot_at(w_pos, w_dst_pos, enemy);
    },
    // update (dt) {},
});