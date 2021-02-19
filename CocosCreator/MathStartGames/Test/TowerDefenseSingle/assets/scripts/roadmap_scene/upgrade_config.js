var ugame = require("ugame");
var index_to_string = ["arrow_tower", "infantry_tower", "warlock_tower", "artillery_tower", "skills_bomb", "skills_infantry"];

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim_root = this.node.getChildByName("anim_root");

        this.btn_reset = this.anim_root.getChildByName("btn_reset");
        this.btn_reset.on(cc.Node.EventType.TOUCH_START, this.on_reset_click, this);

        this.btn_done = this.anim_root.getChildByName("btn_done");
        this.btn_done.on(cc.Node.EventType.TOUCH_START, this.on_done_click, this);

        this.skill1 = this.anim_root.getChildByName("skill1");

        this.config_items = []; // [[0] = [ item1 item2 item3 item4 item5], [1] = [item1 item2 item3 item4 item5]]
        for (let i = 1; i <= 6; i++) {
            let node_skill = this.anim_root.getChildByName("skill" + i);
            if (node_skill) {
                let node_t_list = [];
                for (let j = 1; j <= 5; j++) {
                    let node_t = node_skill.getChildByName("t" + j);
                    // 初始化显示数据
                    this._init_button_info(node_t, i - 1, j - 1);
                    node_t.getChildByName("star_bg").addComponent(cc.Button);
                    node_t_list.push(node_t);

                    // 注册升级click事件
                    let event_handler = new cc.Component.EventHandler();
                    event_handler.target = this.node;
                    event_handler.component = "upgrade_config";
                    event_handler.handler = "on_config_item_click";
                    event_handler.customEventData = i + '' + j;
                    node_t.getComponent(cc.Button).clickEvents.push(event_handler);
                }
                this.config_items.push(node_t_list);
            }
        }

        var cur_user = ugame.get_cur_user();
        this._show_skill_upgrade_config(cur_user.skill_level_info, cur_user.star_num);

        this.outside = false;
    },

    start() {
    },
    on_config_item_click: function(event, skill_index) { // skill_index i j
        console.log("=============aaa", event, skill_index);
        skill_index = parseInt(skill_index);
        var index = Math.floor(skill_index / 10);
        var level = skill_index - index * 10;
        index--; 

        var cur_user = ugame.get_cur_user();
        cur_user.skill_level_info[index] = level;

        // 更新界面
        this._show_skill_upgrade_config(cur_user.skill_level_info, cur_user.star_num);
    },

    // level_config_data item1_level, item2_level, ... item6_level (0~5)
    _show_skill_upgrade_config: function(level_config_data, star_num) {
        var last_star = star_num;
        for (let i = 0; i < level_config_data.length; i++) {
            var level = level_config_data[i];
            for(var j = 0; j < level; j++){
                last_star -= ugame.tower_skills_upgrade_config[index_to_string[i]][j];
            }
        }

        for (let i = 0; i < level_config_data.length; i++) {
            let level = level_config_data[i];

            let line_items = this.config_items[i];
            var j = 0;
            for (j = 0; j < level; j++) {
                this._set_button_state(line_items[j], 2);
            }
            if (j < 5 && last_star >= ugame.tower_skills_upgrade_config[index_to_string[i]][level]) { // 
                this._set_button_state(line_items[j], 1);
                j++;
            }
            for (; j < line_items.length; j++) {
                this._set_button_state(line_items[j], 0);
            }
        }

        // 剩余star数量
        this.anim_root.getChildByName("star").getChildByName("lab_num").getComponent(cc.Label).string = "" + last_star;
    },
    on_done_click: function() {
        if(this.outside===true){
            return;
        }
        this.outside = true;
        // 保存
        ugame.sync_user_data();
        // 返回
        var anim_comp = this.node.getComponent(cc.Animation);
        anim_comp.play("reverse_upgrade_config_enter_anim");
        this.scheduleOnce(function(){
            this.outside = false;
            this.node.active = false;
        }.bind(this), anim_comp.currentClip.duration);
    },
    on_reset_click: function() {
        if(this.outside===true){
            return;
        }
        ugame.init_skill_level_info();
        var cur_user = ugame.get_cur_user();
        this._show_skill_upgrade_config(cur_user.skill_level_info, cur_user.star_num);
    },

    // 控制技能按钮状态  0 置灰 1 可以点击 2 已经升级 不能点击 但是隐藏消耗组件
    _set_button_state: function(item, state) {
        let btn_item = item.getComponent(cc.Button);
        let star_bg = item.getChildByName("star_bg");
        let btn_star_bg = star_bg.getComponent(cc.Button);
        let lab_star_num = star_bg.getChildByName("star_num");
        btn_item.enableAutoGrayEffect = true;
        btn_star_bg.enableAutoGrayEffect = true;

        if (state === 0) {
            btn_item.interactable = false;
            btn_star_bg.interactable = false;
            star_bg.active = true;
        } else if (state === 1) {
            btn_item.interactable = true;
            btn_star_bg.interactable = true;
            star_bg.active = true;
        } else if (state === 2) {
            btn_item.enableAutoGrayEffect = false;
            btn_item.interactable = false;
            btn_star_bg.interactable = false;
            star_bg.active = false;
        }
    },
    // 初始化技能数据 主要是消耗
    _init_button_info: function(node_t, skill_index, skill_level_index) {
        let skills_upgrade_config = ugame.tower_skills_upgrade_config[index_to_string[skill_index]];
        node_t.getChildByName("star_bg").getChildByName("star_num").getComponent(cc.Label).string = "" + skills_upgrade_config[skill_level_index];
    },
    // update (dt) {},
});