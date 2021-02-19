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
    },

    // use this for initialization
    onLoad: function () {
        this.status_state = 0; // 表示没有分的状态
        this.icon = this.node.getChildByName("icon");
        this.h1 = this.node.getChildByName("h1");
        this.h2 = this.node.getChildByName("h2");
        this.flash = this.node.getChildByName("flash");
        
        this.split_speed = 200 + Math.random() * 100;
        
        this.h1.active = false;
        this.h2.active = false;
        this.flash.active = false;
        
        /*this.scheduleOnce(function() {
            this.split_fruit();
        }.bind(this), 3);*/
    },
    
    split_fruit: function(degree) {
        cc.audioEngine.play(cc.url.raw("resources/sounds/splatter.mp3"));
        this.h1.rotation = this.icon.rotation;
        this.h2.rotation = this.icon.rotation;
        // this.flash.rotation += this.icon.rotation;
        this.flash.rotation = degree;
        
        this.icon.active = false;
        this.h1.active = true;
        this.h2.active = true;
        this.status_state = 1; // 表示水果一切开
        this.flash.active = true;
        
        var rot = this.icon.rotation;
        if (rot > 360) {
            var num = Math.floor(rot / 360);
            rot = rot - (num * 360); 
        }
        rot = 360 - rot;
        rot = (rot * Math.PI) / 180;
        
        var h1_vx = -this.split_speed * Math.cos(rot);
        var h1_vy = -this.split_speed * Math.sin(rot);
        
        var h2_vx = -h1_vx;
        var h2_vy = -h1_vy;
        
        this.node.getComponent("throw_action").stop_action();
        
        this.h1.getComponent("throw_action").start_action(h1_vx, h1_vy, -1000);
        this.h2.getComponent("throw_action").start_action(h2_vx, h2_vy, -1000);
        
        this.flash.scaleY = 0;
        var s = cc.scaleTo(0.1, 1, 1);
        var s2 = cc.scaleTo(0.1, 1, 0);
        var seq = cc.sequence([s, s2]);
        this.flash.runAction(seq);
    },
    split_boom: function(degree) {
        cc.audioEngine.play(cc.url.raw("resources/sounds/boom.mp3"));
        // this.h1.rotation = this.icon.rotation;
        // this.h2.rotation = this.icon.rotation;
        this.flash.rotation = degree;
        
        this.icon.active = false;
        // this.h1.active = true;
        // this.h2.active = true;
        this.status_state = 1; // 表示水果一切开
        this.flash.active = true;
        
        var rot = this.icon.rotation;
        if (rot > 360) {
            var num = Math.floor(rot / 360);
            rot = rot - (num * 360); 
        }
        rot = 360 - rot;
        rot = (rot * Math.PI) / 180;
        
        var h1_vx = -this.split_speed * Math.cos(rot);
        var h1_vy = -this.split_speed * Math.sin(rot);
        
        var h2_vx = -h1_vx;
        var h2_vy = -h1_vy;
        
        this.node.getComponent("throw_action").stop_action();
        
        // this.h1.getComponent("throw_action").start_action(h1_vx, h1_vy);
        // this.h2.getComponent("throw_action").start_action(h2_vx, h2_vy);
        
        this.flash.scaleY = 0;
        var s = cc.scaleTo(0.1, 1, 1);
        var s2 = cc.scaleTo(0.1, 1, 0);
        var seq = cc.sequence([s, s2]);
        this.flash.runAction(seq);
    },
    // 游戏更新
    update: function(dt) {
        if(this.status_state !== 1) {
            // 判断自己的位置是否出去
            if(this.node.y <= -600) {
                this.node.removeFromParent();
            }
            return;
        }
        
        var w_pos1 = this.h1.convertToWorldSpace(cc.v2(0, 0));
        var w_pos2 = this.h2.convertToWorldSpace(cc.v2(0, 0));
        
        if (w_pos1.y <= -100 && w_pos2.y <= -100) {
            this.node.removeFromParent();
        }
    },
});
