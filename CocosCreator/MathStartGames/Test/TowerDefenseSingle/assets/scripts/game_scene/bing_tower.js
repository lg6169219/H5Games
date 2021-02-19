var bing_tower_skin = cc.Class({
    name: "bing_tower_skin",
    properties: {
        open_anim: {
            default: [],
            type: cc.SpriteFrame
        },
        anim_duration: 0.2,
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        tower_level: 1,

        tower_skin_set: {
            default: [],
            type: bing_tower_skin
        },

        prefab_bing_actor: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bullet_root = cc.find("UI_ROOT/map_root");
        this.anim = this.node.getChildByName("anim");
        this.anim.addComponent("frame_anim");

        this._set_tower_idle();
    },

    start() {
        // test
        this.schedule(function() {
            var R = 60;
            var r = Math.random() * 2 * Math.PI;
            var pos = cc.v2(R * Math.cos(r), R * Math.sin(r));
            var w_pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
            this.create_bing(cc.v2(w_pos.x + pos.x, w_pos.y + pos.y));
        }.bind(this), 4);
    },
    // 创建小兵的接口
    // 问题 todo 小兵和兵营的层级关系不对，需要对node排序
    create_bing: function(w_dst_pos) {
        // 播放开门动画
        this._play_open_door_anim();
        // 放出多少个兵
        this._create_actor(w_dst_pos);
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
    // 配合动画做延迟出兵
    _create_actor: function(w_dst_pos) {
        var delay = cc.delayTime(0.6);
        var func = cc.callFunc(function() {
            var bing_actor = cc.instantiate(this.prefab_bing_actor);
            this.bullet_root.addChild(bing_actor);
            var bing_actor_comp = bing_actor.getComponent("bing_actor");
            bing_actor_comp.actor_level = this.tower_level;
            bing_actor_comp.create_actor(this.node.convertToWorldSpaceAR(cc.v2(0, 0)), w_dst_pos);
        }.bind(this));

        var seq = cc.sequence([delay, func]);
        this.node.runAction(seq);
    },
    _set_tower_idle: function() {
        var s = this.anim.getComponent(cc.Sprite);
        s.spriteFrame = this.tower_skin_set[this.tower_level - 1].open_anim[0];
    },
    _play_open_door_anim: function() {
        var frame_anim = this.anim.getComponent("frame_anim");
        frame_anim.sprite_frames = this.tower_skin_set[this.tower_level - 1].open_anim;
        frame_anim.duration = this.tower_skin_set[this.tower_level - 1].anim_duration;
        frame_anim.play_once(this._set_tower_idle.bind(this));
    },

    // update (dt) {},
});