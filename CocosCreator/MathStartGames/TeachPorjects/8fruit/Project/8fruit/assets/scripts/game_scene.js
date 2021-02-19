cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        
        fruit_prefabs: {
            type: cc.Prefab,
            default: [],
        },
    },
    
    draw_line: function() {
        var ctx = this.node.getComponent(cc.Graphics);
        ctx.clear();

        var begin = Math.floor(this.start_index);
        for(var i = begin; i < this.point_set.length - 1; i ++) {
            var newPos = this.node.convertToNodeSpaceAR(this.point_set[i]);
            if (i == begin){
                ctx.moveTo(newPos.x, newPos.y);
            }
            else{
                ctx.lineTo(newPos.x, newPos.y);
            }
        }
        ctx.stroke();
    },
    
    filter_line: function() {
        if (this.point_set.length <= 10) {
            return;
        }
        
        if(this.start_index < this.point_set.length - 10) {
            this.start_index = this.point_set.length - 10;
        }
    },
    
    // use this for initialization
    onLoad: function () {
        this.node_speed = 30;
        this.start_index = 0;
        this.in_touch = false;
        this.is_started = false;
        this.total_count = 0;
        this.split_count = 0;
        this.is_end = false;

        this.game_root = cc.find("UI_ROOT/game_root");
        this.start_menu = cc.find("UI_ROOT/start_menu");
        this.start_menu.active = true;   

        this.score_root = cc.find("UI_ROOT/game_top");
        this.score_root.active = false;
        this.score_label = cc.find("UI_ROOT/game_top/score/str").getComponent(cc.Label);
        this.life_label = cc.find("UI_ROOT/game_top/life/str").getComponent(cc.Label);
        
        this.point_set = [];
        this.node.on(cc.Node.EventType.TOUCH_START, function(t){
            this.point_set = [];
            this.start_index = 0;
            this.in_touch = true;
            this.point_set.push(t.getLocation());
        }.bind(this), this.node);
        
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(t) {
            this.point_set.push(t.getLocation());
            this.filter_line();
            this.hit_split_fruit();
            
        }.bind(this), this.node);
        
        this.node.on(cc.Node.EventType.TOUCH_END, function(t) {
            this.point_set = [];
            this.in_touch = false;
            this.start_index = 0;

            var ctx = this.node.getComponent(cc.Graphics);
            ctx.clear();
        }.bind(this), this.node);
        
    },
    
    // iframe通信
    sendRequest(){
        console.log("==========内部request");
        var requestObj = {
            status:0,
            type:"call",
        }
        this.sendMessage(requestObj);
    },
    sendMessage(obj){
        parent.iframeEvent(obj);
    },

    start: function() {
        var self = this;
        window.iframeEvent = function(obj){
            console.log("内部界面接收的消息BB");
            console.log(obj);
            if (obj.goodsSum){
                var globalVar = require('GlobalVar');
                globalVar.lifeCount = obj.goodsSum;
            }
        }
        this.sendRequest();
        
        this.game_root.removeAllChildren();
    },
    
    hit_fruit: function(w_box) {
        if (this.in_touch === false) {
            return false;
        }
        
        var begin = Math.floor(this.start_index);
        
        for(var i = this.point_set.length - 1; i >= begin; i --) {
            if(w_box.contains(this.point_set[i])) {
                return true;
            }
        }
        return false;
    },
    
    update_score: function() {
        this.score_label.string = "" + this.split_count;
    },
    // 生命值
    update_life: function(){
        this.life_label.string = "" + this.life_count;
        if (this.life_count <= 0){
            this.gameOver();
        }
    },
    gen_fruit: function() {
        if(this.is_end){
            return;
        }
        var f_type = this.fruit_prefabs.length * Math.random();
        f_type = Math.floor(f_type);
        if(f_type >= this.fruit_prefabs.length) {
            f_type = this.fruit_prefabs.length - 1;
        }
        
        this.total_count ++;
        var fruit = cc.instantiate(this.fruit_prefabs[f_type]);    
        this.game_root.addChild(fruit);
        fruit.x = 0;
        fruit.y = -400;
        
        var levelCfg = this.getLevelCfg();

        var r = 0.5 * Math.PI + ((Math.random() - 0.5) * Math.PI / 6)
        var speed = levelCfg.speed;
        var vx = speed * Math.cos(r);
        var vy = speed * Math.sin(r);

        fruit.getComponent("throw_action").start_action(vx, vy, levelCfg.g);
        this.update_score();
        
        this.scheduleOnce(this.gen_fruit.bind(this), Math.random() * levelCfg.interval);
    },
    // 特殊攻击，同时丢一个水果和炸弹
    special_attack: function(){
        var f_type = this.fruit_prefabs.length * Math.random();
        f_type = Math.floor(f_type);
        if(f_type >= this.fruit_prefabs.length) {
            f_type = this.fruit_prefabs.length - 1;
        }
        
        this.total_count ++;
        var fruit = cc.instantiate(this.fruit_prefabs[f_type]);    
        this.game_root.addChild(fruit);
        fruit.x = 0;
        fruit.y = -400;
        
        var levelCfg = this.getLevelCfg();

        var r1 = 0.5 * Math.PI + ((Math.random() - 0.5) * Math.PI / 6)
        var speed = levelCfg.speed;
        var vx = speed * Math.cos(r1);
        var vy = speed * Math.sin(r1);
        

        fruit.getComponent("throw_action").start_action(vx, vy, levelCfg.g);

        var f_type = this.fruit_prefabs.length - 1;
        this.total_count ++;
        var fruit = cc.instantiate(this.fruit_prefabs[f_type]);    
        this.game_root.addChild(fruit);
        fruit.x = 0;
        fruit.y = -400;
        
        var r = Math.PI - r1;
        var speed = levelCfg.speed;
        var vx = speed * Math.cos(r);
        var vy = speed * Math.sin(r);
        
        fruit.getComponent("throw_action").start_action(vx, vy, levelCfg.g);   
    },
    on_start_game: function() {
        if (this.is_started === true) {
            return;
        }
        
        this.is_started = true;
        this.start_menu.active = false;
        this.score_root.active = true;
        this.split_count = 0;
        this.update_score();

        var globalVar = require('GlobalVar');
        this.life_count = globalVar.lifeCount;
        this.update_life();
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.gen_fruit.bind(this), Math.random() * 2);

        // 每8秒一次特殊攻击
        this.schedule(this.special_attack.bind(this), 8);
    },
    
    hit_split_fruit: function() {
        for(var i = 0; i < this.game_root.children.length; i ++) {
            var fruit = this.game_root.children[i];
            var fruit_com = fruit.getComponent("fruit");
            if(fruit_com.status_state !== 0) {
                continue;
            }
            
            var w_box = fruit.getBoundingBoxToWorld();
            if (this.hit_fruit(w_box)) {
                fruit.getComponent("throw_action").stop_action();
                var dir = this.point_set[this.point_set.length - 1].sub(this.point_set[Math.floor(this.start_index)])
                var degree = Math.atan2(dir.y, dir.x) * 180 / Math.PI;
                // fruit_com.split_fruit(360 - degree);
                this.point_set = [];
                this.start_index = 0;
                
                if (fruit.name == "boom"){
                    var boompfxnode = fruit.getChildByName("boompfx");
                    boompfxnode.active = true;
                    var frame_anima = boompfxnode.getComponent("frame_anima");
                    frame_anima.play_once(function(){
                        fruit.removeFromParent();
                    });

                    this.life_count --;
                    this.life_count = Math.max(0, this.life_count);
                    this.update_life();
                    fruit_com.split_boom(360 - degree);
                }else{
                    var boompfxnode = fruit.getChildByName("boompfx");
                    if (boompfxnode){
                        boompfxnode.active = true;
                        var frame_anima = boompfxnode.getComponent("frame_anima");
                        frame_anima.play_once(function(){
                            boompfxnode.active = false;
                        });
                    }

                    var dibanpfxnode = fruit.getChildByName("dibanpfx");
                    if (dibanpfxnode){
                        dibanpfxnode.active = true;
                        var frame_anima = dibanpfxnode.getComponent("frame_anima");
                        frame_anima.play_once(function(){
                        });
                    }

                    this.split_count ++;
                    this.update_score();
                    fruit_com.split_fruit(360 - degree);                   
                }
                return;
            }
        }  
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.is_end){
            return;
        }
        if (this.in_touch) {
            var s = this.node_speed * dt;
            this.start_index += s;
            this.draw_line();
        }
    },

    // 游戏结束
    gameOver: function(){
        if(this.is_end){
            return;
        }
        this.is_end = true;
        this.unschedule(this.special_attack);
        var ss = this.getComponent(cc.AudioSource);
        if(ss){
            ss.stop();
        }

        var glovalVar = require("GlobalVar");
        glovalVar.finalScore = this.split_count;
        
        this.scheduleOnce(function(){
            cc.audioEngine.play(cc.url.raw("resources/sounds/audio_end.mp3"));
            cc.director.loadScene("OverScene");
        }, 1.5);
    },

    getLevelCfg : function(){
        var glovalVar = require("GlobalVar");
        var level = 0;
        for(var i = 0; i < glovalVar.lvByScore.length; i++){
            var cfg = glovalVar.lvByScore[i];
            if (this.split_count >= cfg.score){
                level = cfg.level;
            }else{
                break;
            }
        }
        return glovalVar.hardCfg[level] || glovalVar.hardCfg[0];
    },
});
