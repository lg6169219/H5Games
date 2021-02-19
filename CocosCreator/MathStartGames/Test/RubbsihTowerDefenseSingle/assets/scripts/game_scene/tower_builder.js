var Tower_Type = require("tower");
var ugame = require("ugame");

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:
    // build_arrow_icon build_bing_icon build_fasi_icon  build_zd_icon
    onLoad() {
        this.map_root = cc.find("UI_ROOT/map_root");

        this.click_mask = this.node.getChildByName("click_mask");
        this.click_mask.on(cc.Node.EventType.TOUCH_START, this.show_gui_tower_builder, this);

        this.bg_img = this.node.getChildByName("bg_img");
        this.is_builded = false;
        this.builded_tower = null;

        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");

        this.tower_params = [];
        this.tower_params[0] = require("fashi_tower_params");
        this.tower_params[1] = require("fashi_tower_params");
        this.tower_params[2] = require("fashi_tower_params");
        this.tower_params[3] = require("fashi_tower_params");
    },

    start() {},

    show_gui_tower_builder: function() {
        if (this.game_scene.game_started == false) {
            return;
        }

        var gui_tower_builder = cc.find("UI_ROOT/gui_tower_builder");
        var center_pos = this.node.getPosition();
        gui_tower_builder.setPosition(center_pos);

        gui_tower_builder.getComponent("gui_tower_builder").show_tower_builder(this.node);
    },

    remove_tower: function() {
        if (this.is_builded === false) {
            return;
        }

        this.builded_tower.removeFromParent();
        this.builded_tower = null;
        this.is_builded = false;
        this.bg_img.active = true;
    },

    undo_tower: function() {
        if (this.is_builded === false) {
            return;
        }

        var tower_com = this._get_curr_tower_com();
        var tower_level = this.get_cur_tower_level() - 1; // 当前等级
        var params = this.tower_params[tower_com.tower_type];
        var give_chip = params[tower_level].build_chip;
        ugame.add_chip(give_chip);
        this.game_scene.update_user_info();


        this.builded_tower.removeFromParent();
        this.builded_tower = null;
        this.is_builded = false;
        this.bg_img.active = true;
    },

    check_can_build_tower: function(tower_type, tower_level) {
        var params = this.tower_params[tower_type];
        if (!params) {
            return false;
        }
        var need_chip = params[tower_level].build_chip;
        var have_chip = ugame.get_chip();
        if (have_chip >= need_chip) {
            return true;
        } else {
            return false;
        }
    },

    build_tower: function(tower_type, builded_tower_prefab, offset_pos) {
        if (tower_type < 0 || tower_type > 3) {
            return;
        }
        if (!this.check_can_build_tower(tower_type, 0)) {
            return
        }

        var params = this.tower_params[tower_type];
        var need_chip = params[0].build_chip;
        ugame.add_chip(-need_chip);
        this.game_scene.update_user_info();

        this.bg_img.active = false;

        // 造塔
        var builded_tower = cc.instantiate(builded_tower_prefab);
        this.builded_tower = builded_tower;
        this.map_root.addChild(this.builded_tower);

        var center_pos = this.node.getPosition();
        center_pos.x += offset_pos.x;
        center_pos.y += offset_pos.y;
        this.builded_tower.setPosition(center_pos);

        this.is_builded = true;
    },

    // 升级塔
    check_can_upgrade_tower: function() {
        var tower_level = this.get_cur_tower_level() - 1; // 当前等级
        var next_tower_level = tower_level + 1;

        var tower_com = this._get_curr_tower_com();
        var tower_type = tower_com.tower_type;
        var params = this.tower_params[tower_type];
        if (!params) {
            return false;
        }
        var need_chip = params[next_tower_level].build_chip - params[tower_level].build_chip;
        var have_chip = ugame.get_chip();
        if (have_chip >= need_chip) {
            return true;
        } else {
            return false;
        }
    },

    upgrade_tower: function() {
        if (this.is_builded === false || this.builded_tower === null) {
            return;
        }
        if (!this.check_can_upgrade_tower()) {
            return;
        }
        var tower_com = this._get_curr_tower_com();
        if (tower_com) {
            var tower_level = this.get_cur_tower_level() - 1; // 当前等级
            var next_tower_level = tower_level + 1;
            var params = this.tower_params[tower_com.tower_type];
            var need_chip = params[next_tower_level].build_chip - params[tower_level].build_chip;
            ugame.add_chip(-need_chip);
            this.game_scene.update_user_info();

            tower_com.upgrade_tower();
        }
    },

    is_full_level: function() {
        var is_full = false;
        var tower_com = this._get_curr_tower_com();
        if (tower_com) {
            is_full = tower_com.is_full_level() === true
        }
        return is_full;
    },
    _get_curr_tower_com: function() {
        var tower_com = null;
        if (this.is_builded === false || this.builded_tower === null) {
            return tower_com;
        }

        tower_com = this.builded_tower.getComponent("common_tower");
        return tower_com;
    },
    get_cur_tower_level: function() {
        var tower_com = this._get_curr_tower_com();
        if (tower_com) {
            return tower_com.tower_level;
        }
        return null;
    },
    // update (dt) {},
});