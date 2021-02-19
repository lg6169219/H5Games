var Tower_Type = require("tower");
var ugame = require("ugame");

cc.Class({
    extends: cc.Component,

    properties: {
        tower_prefabs: { // 弓箭 法师  炮塔 兵塔
            default: [],
            type: cc.Prefab
        },
        tower_offset: {
            default: [],
            type: cc.Vec2
        }
    },

    // LIFE-CYCLE CALLBACKS:
    // build_arrow_icon build_bing_icon build_fasi_icon  build_zd_icon
    onLoad() {
        this.gui_builder = this.node.getChildByName("gui_builder");

        this.mask = this.gui_builder.getChildByName("mask");
        this.mask.on(cc.Node.EventType.TOUCH_START, this.hide_tower_builder, this);

        // 4个塔的按钮
        this.build_arrow_icon = this.gui_builder.getChildByName("build_arrow_icon");
        this.build_arrow_icon.tower_type = Tower_Type.ARROW;
        this.build_arrow_icon.on(cc.Node.EventType.TOUCH_START, this.on_tower_build_click, this);

        this.build_bing_icon = this.gui_builder.getChildByName("build_bing_icon");
        this.build_bing_icon.tower_type = Tower_Type.BING;
        this.build_bing_icon.on(cc.Node.EventType.TOUCH_START, this.on_tower_build_click, this);

        this.build_fasi_icon = this.gui_builder.getChildByName("build_fasi_icon");
        this.build_fasi_icon.tower_type = Tower_Type.FASHI;
        this.build_fasi_icon.on(cc.Node.EventType.TOUCH_START, this.on_tower_build_click, this);

        this.build_zd_icon = this.gui_builder.getChildByName("build_zd_icon");
        this.build_zd_icon.tower_type = Tower_Type.PAO;
        this.build_zd_icon.on(cc.Node.EventType.TOUCH_START, this.on_tower_build_click, this);

        this.gui_builder.active = false;

        // 升级和撤销塔
        this.gui_undo = this.node.getChildByName("gui_undo");

        this.gui_undo_mask = this.gui_undo.getChildByName("mask");
        this.gui_undo_mask.on(cc.Node.EventType.TOUCH_START, this.hide_tower_builder, this);

        this.btn_undo = this.gui_undo.getChildByName("undo");
        this.btn_undo.on(cc.Node.EventType.TOUCH_START, this.on_tower_undo_click, this);

        this.btn_upgrade = this.gui_undo.getChildByName("upgrade");
        this.btn_upgrade.on(cc.Node.EventType.TOUCH_START, this.on_tower_upgrade_click, this);
        this.btn_upgrade.getComponent(cc.Button).interactable = true;
        this.btn_upgrade.getComponent(cc.Button).enableAutoGrayEffect = true;

        this.gui_undo.active = false;
    },

    start() {},

    show_tower_builder: function(node_tower_builder) {
        this.tower_builder_comp = node_tower_builder.getComponent("tower_builder");
        if (this.tower_builder_comp.is_builded === false) {
            this.gui_builder.active = true;
            this.gui_undo.active = false;

            // 打开动画
            this.gui_builder.scale = 0;
            var cc_scal = cc.scaleTo(0.3, 1).easing(cc.easeBackInOut());
            this.gui_builder.runAction(cc_scal);
        } else {
            // 显示撤销
            this.gui_builder.active = false;
            this.gui_undo.active = true;

            this.btn_upgrade.getComponent(cc.Button).interactable = true;

            if (this.tower_builder_comp.is_full_level() === true) {
                this.btn_upgrade.getComponent(cc.Button).interactable = false;
            }

            // 打开动画
            this.gui_undo.scale = 0;
            var cc_scal = cc.scaleTo(0.3, 1).easing(cc.easeBackInOut());
            this.gui_undo.runAction(cc_scal);
        }
    },

    hide_tower_builder: function() {
        // 关闭动画
        var cc_scal = cc.scaleTo(0.1, 0);
        var call_func = cc.callFunc(function() {
            this.gui_builder.active = false;
            this.gui_undo.active = false;
        }.bind(this));
        var seq = cc.sequence([cc_scal, call_func]);
        this.gui_builder.runAction(seq);
        this.gui_undo.runAction(seq);
    },

    // 撤销
    on_tower_undo_click: function() {
        this.gui_undo.active = false;

        this.tower_builder_comp.undo_tower();
    },
    // 升级
    on_tower_upgrade_click: function() {
        this.gui_undo.active = false;
        if (this.tower_builder_comp.is_full_level() === true) {
            return;
        }
        this.tower_builder_comp.upgrade_tower();
    },
    // 建造
    on_tower_build_click: function(e) {
        var tower_type = e.target.tower_type;
        if (tower_type < 0 || tower_type > 3) {
            return;
        }

        this.gui_builder.active = false;
        this.tower_builder_comp.build_tower(tower_type, this.tower_prefabs[tower_type], this.tower_offset[tower_type]);
    },
    // update (dt) {},
});