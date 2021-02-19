var ugame = require("ugame");

var State = {
    IDLE: 0, // 静止
    WALK: 1,
    ATTACK: 2,
    DEAD: 3,
    ARRIVED: 4
};

var Direction = {
    INVALID_DIR: -1,
    UP_DIR: 0,
    DOWN_DIR: 1,
    LEFT_DIR: 2,
    RIGHT_DIR: 3,
};
var walk_anim_params = cc.Class({
    name: "walk_anim_params",
    properties: {
        anim_frames: {
            type: cc.SpriteFrame,
            default: [],
        },
        anim_duration: 0.05,
        scale_x: 1
    }
});
cc.Class({
    extends: cc.Component,

    properties: {
        walk_anim_set: { // 0上 1下 2左 3右
            default: [],
            type: walk_anim_params
        },
        actor_type: 0, // 怪物类型  与tower_type 一致
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.speed = 50;
        this.state = State.IDLE;

        this.anim = this.node.getChildByName("anim");
        this.frame_anim = this.anim.addComponent("frame_anim");
        this.blood_bar = this.node.getChildByName("blood_bar"); // 血条

        this.anim_dir = Direction.INVALID_DIR;

        this.actor_game_params = null;

        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");

        this.is_paused = false; // 暂停标记

        this.end_pos = cc.v2(0, 0); // 参与计算用的
        this.now_pos = cc.v2(0, 0);
    },

    start() {},

    set_actor_game_params: function(actor_game_params) {
        this.actor_game_params = actor_game_params;
        this.speed = this.actor_game_params.speed;
        this.max_health = this.actor_game_params.health;
        this.health = this.actor_game_params.health;
        this.player_hurt = this.actor_game_params.player_hurt;
        this.dead_chip = this.actor_game_params.add_chip;
    },
    // 在地图的某条路线上创建一个怪物
    create_at_road: function(road_data) {
        if (road_data.length < 2) {
            return;
        }

        this.node.getChildByName("lab_name").getComponent(cc.Label).string = this.actor_game_params.name;

        this.node.setPosition(road_data[0]);
        this.road_data = road_data;
        this.state = State.WALK;
        this.next_step = 1;
        this.walk_to_next();
    },

    play_walk_anim: function(dir) {
        var r = Math.atan2(dir.y, dir.x); // 取值范围[-PI - PI]
        // [-PI, -3/4 PI) 左,  [-3/4PI, -1/4PI) 下， [-1/4PI, 1/4 PI) 右, [1/4 PI, 3/ 4PI] 上
        // [3/4 PI, PI) 左

        // 目前只有两种动画 左右
        var dir_state = Direction.INVALID_DIR;
        if (r >= -Math.PI && r < -0.75 * Math.PI) {
            dir_state = Direction.LEFT_DIR;
        } else if (r >= -0.75 * Math.PI && r < -0.25 * Math.PI) {
            dir_state = Direction.DOWN_DIR;
        } else if (r >= -0.25 * Math.PI && r < 0.25 * Math.PI) {
            dir_state = Direction.RIGHT_DIR;
        } else if (r >= 0.25 * Math.PI && r < 0.75 * Math.PI) {
            dir_state = Direction.UP_DIR;
        } else {
            dir_state = Direction.LEFT_DIR;
        }
        if (dir_state == this.anim_dir) {
            return;
        }

        this.anim_dir = dir_state;
        this.frame_anim.stop_anim();
        this.frame_anim.sprite_frames = this.walk_anim_set[this.anim_dir].anim_frames;
        this.frame_anim.duration = this.walk_anim_set[this.anim_dir].anim_duration;
        this.anim.scaleX = this.walk_anim_set[this.anim_dir].scale_x;
        this.frame_anim.play_loop();
    },
    // 开始走到下一个点
    walk_to_next: function() {
        // 计算走到下一个目的地的时间
        var start_pos = this.node.getPosition();
        var end_pos_data = this.road_data[this.next_step];

        this.end_pos.x = end_pos_data.x;
        this.end_pos.y = end_pos_data.y;

        var dir = this.end_pos.sub(start_pos);
        var len = dir.mag();
        this.walk_time_total = len / this.speed;

        this.vx = this.speed * dir.x / len; // x轴分速度
        this.vy = this.speed * dir.y / len; // y轴分速度
        this.walk_time = 0; // 已行走的时间

        this.play_walk_anim(dir);
    },
    walk_update: function(dt) {
        if (this.state != State.WALK) {
            return;
        }
        this.walk_time += dt;
        if (this.walk_time >= this.walk_time_total) { // 走到了终点
            dt -= (this.walk_time - this.walk_time_total); // 去掉多的时间
        }

        var sx = this.vx * dt;
        var sy = this.vy * dt;

        this.node.x += sx;
        this.node.y += sy;

        if (this.walk_time > this.walk_time_total) {
            this.next_step++;
            if (this.next_step >= this.road_data.length) { // 到达了路的终点
                this.state = State.ARRIVED;
                this.attack_player();
            } else {
                this.walk_to_next();
            }
        }
    },
    // 攻击玩家
    attack_player: function() {
        this.game_scene.on_player_attacked(this.player_hurt);
        // 删除节点
        ugame.remove_enemy(this.node);
        this.node.removeFromParent();
    },
    update(dt) {
        if (ugame.is_game_started === false) {
            this.frame_anim.stop_anim();
            return;
        }
        if (ugame.is_game_paused === true) {
            this.frame_anim.stop_anim();
            this.is_paused = true;
            return;
        }

        if (this.is_paused) { // 暂停恢复的时候 恢复动画
            this.frame_anim.play_loop();
            this.is_paused = false;
        }
        if (this.state === State.WALK) {
            this.walk_update(dt);
        }
    },
    // 经过dt时间的位置
    // 为了计算攻击的提前量
    position_after_time: function(dt) {
        if (this.state != State.WALK) {
            return this.node.getPosition();
        }

        // 物体正在运动
        var prev_pos = this.node.getPosition();
        var next_step = this.next_step;

        while (dt > 0 && next_step < this.road_data.length) {
            var now_pos_data = this.road_data[next_step];
            this.now_pos.x = now_pos_data.x;
            this.now_pos.y = now_pos_data.y;

            var dir = this.now_pos.sub(prev_pos);
            var len = dir.mag();

            var t = len / this.speed;

            if (dt > t) {
                dt -= t;
                prev_pos = this.now_pos;
                next_step++;
            } else {
                var vx = this.speed * dir.x / len;
                var vy = this.speed * dir.y / len;
                var sx = vx * dt;
                var sy = vy * dt;

                prev_pos.x += sx;
                prev_pos.y += sy;

                return prev_pos;
            }
        }
        return this.road_data[next_step - 1];
    },
    actor_dead: function() {
        this.state = State.DEAD;

        ugame.add_chip(this.dead_chip);
        this.game_scene.update_user_info();

        // 播放死亡动画
        ugame.remove_enemy(this.node);
        this.node.removeFromParent();
    },
    modify_hp: function(val) { // val 正加血 负减血
        this.health += val;

        if (this.health <= 0) {
            this.health = 0;
            this.actor_dead();
        } else {
            var per = this.health / this.max_health;
            this.blood_bar.getChildByName("bar").getComponent(cc.ProgressBar).progress = per;
        }
    },
    // 受到攻击
    on_get_attack: function(attack_val) {
        this.modify_hp(-attack_val);
    },
});