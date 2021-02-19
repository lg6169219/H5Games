var sound_manager = require("sound_manager");
var ugame = require("ugame");
cc.Class({
    extends: cc.Component,

    properties: {
        actor_prefabs: {
            default: [],
            type: cc.Prefab
        },

        game_map_set: {
            default: [],
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.map_root = cc.find("UI_ROOT/map_root");

        this.anchor_center = this.node.getChildByName("anchor-center");
        // this.anchor_center.getChildByName("btn_back").on(cc.Node.EventType.TOUCH_START, this.back_home_scene, this);


        // 暂停恢复按钮
        this.anchor_center_top = this.node.getChildByName("anchor-center-top");
        this.pause_root = this.anchor_center_top.getChildByName("pause_root");
        this.pause_root.getChildByName("btn_resume").on(cc.Node.EventType.TOUCH_START, this.on_resume_game_click, this);
        // 设置
        this.setting_root = this.anchor_center_top.getChildByName("setting_root");
        this.setting_root.getChildByName("btn_close").on(cc.Node.EventType.TOUCH_START, this.on_setting_close_click, this);
        this.setting_root.getChildByName("btn_replay").on(cc.Node.EventType.TOUCH_START, this.on_setting_replay_click, this);
        this.setting_root.getChildByName("btn_exit").on(cc.Node.EventType.TOUCH_START, this.back_home_scene, this);

        // top_right
        this.anchor_top_right = this.node.getChildByName("anchor-top-right");
        this.btn_pause = this.anchor_top_right.getChildByName("btn_pause");
        this.btn_pause.on(cc.Node.EventType.TOUCH_START, this.on_pause_click, this);

        this.btn_pause = this.anchor_top_right.getChildByName("btn_pause");
        this.btn_pause.on(cc.Node.EventType.TOUCH_START, this.on_pause_click, this);

        this.btn_setting = this.anchor_top_right.getChildByName("btn_setting");
        this.btn_setting.on(cc.Node.EventType.TOUCH_START, this.on_setting_click, this);


        // top_left
        this.anchor_top_left = this.node.getChildByName("anchor-top-left");
        this.ugame_root = this.anchor_top_left.getChildByName("ugame_root");
        this.lab_blood = this.ugame_root.getChildByName("lab_blood").getComponent(cc.Label);
        this.lab_chip = this.ugame_root.getChildByName("lab_chip").getComponent(cc.Label);
        this.lab_round = this.ugame_root.getChildByName("lab_round").getComponent(cc.Label);

        // anchor-bottom
        this.anchor_bottom = this.node.getChildByName("anchor-bottom");
        this.gui_start_button = this.anchor_bottom.getChildByName("gui_start_button");
        this.gui_start_button.on(cc.Node.EventType.TOUCH_START, this.on_start_game_click, this);

        this.go_back = false;
        this.game_started = false;
        ugame.is_game_paused = false;

        // ui_check_out
        this.gui_check_out = cc.find("UI_ROOT/gui_check_out");
        this.gui_check_out_comp = this.gui_check_out.getComponent("gui_check_out");
        this.gui_check_out.active = false;

        this.map_level = ugame.get_cur_level();
        if (this.map_level >= this.game_map_set.length) {
            this.map_level = this.game_map_set.length - 1;
        }
        this.game_map = cc.instantiate(this.game_map_set[this.map_level]);
        this.node.addChild(this.game_map, -10);

        this.tower_tag = this.game_map.getChildByName("tower_tag");
    },

    start() {
        this.loading_door_comp = this.node.getChildByName("loading_door").getComponent("loading_door");
        this.loading_door_comp.open_the_door();

        var random_music_index = Math.floor(Math.random() * 5 + 1);
        cc.loader.loadRes("sounds/music/game_bg" + random_music_index, cc.AudioClip, function(err, clip) {
            sound_manager.play_music(clip, true);
        });

        // 初始化ugame数据
        var cur_user = ugame.get_cur_user();
        this.blood = cur_user.blood;

        // 生成怪物
        this.level_data = require("map_level" + (this.map_level + 1)); // 地图配置数据
        this.cur_round = 0; // 当前是第几波
        this.cur_create_total = 0; // 当前需要产生的总数
        this.cur_create_num = 0; // 当前已经产生的总数

        this.update_user_info();
    },
    // 开始游戏
    start_game: function() {
        if (this.game_started === true) {
            return;
        }
        // 删除敌人集合
        ugame.clear_enemy_set();
        // 取消所有定时器
        this.unscheduleAllCallbacks();
        // 取消所有的塔
        for (var i = 0; i < this.tower_tag.children.length; i++) {
            var tower_builder = this.tower_tag.children[i].getComponent("tower_builder");
            tower_builder.remove_tower();
        }
        this.map_root.removeAllChildren();

        this.all_enemy_created = false;

        this.game_started = true;
        ugame.is_game_started = true;

        // 初始化ugame数据
        var cur_user = ugame.get_cur_user();
        this.blood = cur_user.blood;

        this.cur_round = 0; // 当前是第几波
        this.cur_create_total = 0; // 当前需要产生的总数
        this.cur_create_num = 0; // 当前已经产生的总数

        this.create_round_enemy();

        this.update_user_info();
    },
    create_one_enemy: function(cur_round_params, type) {
        if (this.game_started === false) {
            return;
        }

        if (!cur_round_params) {
            return;
        }

        var road_set = cur_round_params.road_set;
        var random_road = cur_round_params.random_road;

        var map_road_set = ugame.get_map_road_set();

        var enemy = cc.instantiate(this.actor_prefabs[type]);
        this.map_root.addChild(enemy);
        ugame.add_enemy(enemy);

        var actor = enemy.getComponent("actor");
        var index = 0;
        if (random_road === true) {
            index = Math.floor(Math.random() * road_set.length); // 0~length-1
        } else {
            index = this.road_count;
            this.road_count++;
            if (this.road_count >= road_set.length) {
                this.road_count = 0;
            }
        }
        if (index >= map_road_set.length) {
            index = 0;
        }
        var road_type = road_set[index];
        actor.set_actor_game_params(cur_round_params.actor_params);
        actor.create_at_road(map_road_set[road_type]);

        // 记录产生数
        this.cur_create_num++;

        if (this.cur_create_num >= this.cur_create_total) { // 可以生成下一波敌人
            this.create_round_enemy();
            this.update_user_info();
        }
    },
    // 生成一波怪物
    create_round_enemy: function() {
        if (this.cur_round >= this.level_data.length) {
            // 全部敌人产生完毕
            this.all_enemy_created = true;
            return;
        }

        var cur_round_params = this.level_data[this.cur_round];
        if (!cur_round_params) {
            return;
        }

        this.cur_round++;

        var create_delay_set = cur_round_params.create_delay;
        var create_num = cur_round_params.num;
        var create_time_set = cur_round_params.create_time_set;

        var create_type = cur_round_params.type;

        this.cur_create_num = 0;
        this.cur_create_total = 0; // 记录当前波需要产生的总怪物数

        this.road_count = 0; // 路径分布计数
        var create_delay = 0; // 创建时间延迟计数
        for (let j = 0; j < create_num.length; j++) {
            let num = create_num[j];
            let type = create_type[j];
            let create_time = create_time_set[j];
            create_delay += create_delay_set;

            for (let i = 0; i < num; i++) {
                create_delay += create_time[i];
                this.cur_create_total++;

                this.scheduleOnce(function() {
                    this.create_one_enemy(cur_round_params, type);
                }.bind(this), create_delay);
            }
        }
    },

    // 游戏胜利检测
    check_game_success: function() {
        if (this.all_enemy_created === true && this.game_started === true && ugame.get_enemy_set().length <= 0 && this.blood > 0) {
            this.game_started = false;
            ugame.is_game_started = false;
            this.show_gui_game_success();
        }
    },
    back_home_scene: function() {
        if (this.go_back) {
            return;
        }
        this.go_back = true;
        this.setting_root.active = false;

        this.loading_door_comp.close_the_door(function() {
            cc.director.loadScene("roadmap_scene", function() {});
        }.bind(this));
    },
    // 暂停
    on_pause_click: function() {
        this.pause_root.active = true;
        ugame.is_game_paused = true;
    },
    // 恢复
    on_resume_game_click: function() {
        this.pause_root.active = false;
        ugame.is_game_paused = false;
    },

    // 设置
    on_setting_click: function() {
        this.setting_root.active = true;
        ugame.is_game_paused = true;
    },
    on_setting_close_click: function() {
        this.setting_root.active = false;
        ugame.is_game_paused = false;
    },
    // 重玩
    on_setting_replay_click: function() {
        this.setting_root.active = false;
        this.game_started = false;
        ugame.is_game_paused = false;

        this.start_game();
    },
    on_start_game_click: function() {
        this.start_game();
    },
    // 更新血量
    update_user_info: function() {
        var cur_user = ugame.get_cur_user();

        this.lab_blood.string = "" + this.blood;
        this.lab_chip.string = "" + ugame.get_chip();
        this.lab_round.string = "round " + this.cur_round + "/" + this.level_data.length;
    },

    // 失败界面
    show_gui_game_failed: function() {
        this.gui_check_out.active = true;
        this.gui_check_out_comp.show_failed();
    },
    // 成功界面
    show_gui_game_success: function() {
        this.gui_check_out.active = true;
        var cur_user = ugame.get_cur_user();
        this.gui_check_out_comp.show_successed(this.blood, cur_user.blood);
    },

    // 玩家受到攻击 player_hurt攻击力
    on_player_attacked: function(player_hurt) {
        if (this.game_started === false) {
            return;
        }

        this.blood -= player_hurt;
        if (this.blood <= 0) {
            this.blood = 0;
            //玩家挂了
            this.game_started = false;
            ugame.is_game_started = false;
            this.show_gui_game_failed();
        }

        this.update_user_info();
    },
    update(dt) {
        if (this.game_started === false) {
            return;
        }

        this.check_delta = this.check_delta || 0;
        this.check_delta += dt;

        if (this.check_delta >= 1.5) {
            this.check_game_success();
            this.check_delta = 0;
        }
    },
});