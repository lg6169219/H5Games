var bing_actor_params = require("bing_actor_params");

var bing_actor_skin = cc.Class({
    name: "bing_actor_skin",
    properties: {
        walk_anim: {
            type: cc.SpriteFrame,
            default: []
        },
        walk_duration: 0.1,

        attack_anim: {
            type: cc.SpriteFrame,
            default: []
        },
        attack_duration: 0.1,

        dead_anim: {
            type: cc.SpriteFrame,
            default: []
        },
        dead_duration: 0.1,
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        actor_level: 1, //兵等级

        bing_actor_set: {
            default: [],
            type: bing_actor_skin
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.node.getChildByName("anim");
        this.anim.addComponent("frame_anim");

        this._set_actor_idle(1);

        // ai
        this.state = 0; // 0 idle, 1 walk, 2 attack, 3 dead
        this.walk_dst_pos = cc.v2(0, 0);
        this.walk_time = 0;
        this.walk_vx = 0;
        this.walk_vy = 0;

        this.face_dir = 1; // walk朝向 1向右  0向左
    },

    start() {},


    // 假设没有敌人，走到指定的位置，等待敌人
    create_actor: function(w_start_pos, w_dst_pos) {
        this._set_actor_idle(this.face_dir);

        this.speed = bing_actor_params[this.actor_level - 1].speed;
        // var bing_actor_param = bing_actor_params[this.actor_level - 1];

        var start_pos = this.node.parent.convertToNodeSpaceAR(w_start_pos);
        this.node.setPosition(start_pos);
        this.walk_to_dst(w_dst_pos);
    },

    walk_to_dst: function(w_dst_pos) {
        this.state = 1; // 当前是行走状态

        this.walk_dst_pos = this.node.parent.convertToNodeSpaceAR(w_dst_pos);
        var start_pos = this.node.getPosition();

        var dir = this.walk_dst_pos.sub(start_pos);
        var len = dir.mag();
        this.walk_time = len / this.speed;

        this.walk_vx = this.speed * dir.x / len; // cos(R) = dir.x / len  walk_vx是speed在x上的分速度
        this.walk_vy = this.speed * dir.y / len;

        this.face_dir = this.walk_vx < 0 ? 0 : 1;
        if (this.face_dir === 0) {
            this.anim.scaleX = -1;
        } else {
            this.anim.scaleX = 1;
        }

        // 播放行走动画
        var frame_anim = this.anim.getComponent("frame_anim");
        frame_anim.sprite_frames = this.bing_actor_set[this.actor_level - 1].walk_anim;
        frame_anim.duration = this.bing_actor_set[this.actor_level - 1].walk_duration;
        frame_anim.play_loop();
    },
    // 小兵AI
    actor_ai: function() {
        if (this.state === 3) { // 死亡
            return;
        }
    },
    _set_actor_idle: function(b_right) {
        if (b_right) {
            this.anim.scaleX = 1;
        } else {
            this.anim.scaleX = -1;
        }

        var s = this.anim.getComponent(cc.Sprite);
        s.spriteFrame = this.bing_actor_set[this.actor_level - 1].walk_anim[0];
    },

    _walk_update: function(dt) {
        if (this.walk_time <= 0) {
            // 回到idle状态
            this.state = 0;
            this.walk_vx = 0;
            this.walk_vy = 0;
            var frame_anim = this.anim.getComponent("frame_anim");
            frame_anim.stop_anim();
            this._set_actor_idle(this.face_dir);
            return;
        }
        if (this.walk_time < dt) {
            dt = this.walk_time;
        }
        // 设置玩家的行走
        var sx = this.walk_vx * dt;
        var sy = this.walk_vy * dt;
        this.node.x += sx;
        this.node.y += sy;

        this.walk_time -= dt;
    },
    update(dt) {
        if (this.state === 0) {
            return;
        } else if (this.state === 1) {
            this._walk_update(dt);
            return;
        }
    },
});