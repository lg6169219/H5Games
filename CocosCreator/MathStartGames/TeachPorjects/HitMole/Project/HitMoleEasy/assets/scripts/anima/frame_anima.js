// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 帧动画的图片，多张图片
        sprite_frames : {
            default : [],
            type : cc.SpriteFrame,
        },

        duration : 0.1, // 帧时间间隔
        loop : false, // 是否循环播放
        play_onload : false, // 是否在加载时候就开始播放
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.end_func = null;
        this.is_playing = false;
        this.play_time = 0; //播放动画的时间

        this.sprite = this.getComponent(cc.Sprite);
        if(!this.sprite){
            this.sprite = this.addComponent(cc.Sprite);
        }

        // 加载时候开始播放
        if(this.play_onload){
            if(this.loop){
                this.play_loop();
            }else{
                this.play_once(null);
            }
        }
    },

    start () {

    },
    play_loop : function(){
        if(this.sprite_frames.length <= 0){
            return;
        }

        this.loop = true;
        this.end_func = null;

        this.is_playing = true;
    },

    // 需要播放结束回调
    play_once : function(end_func){
        if(this.sprite_frames.length <= 0){
            return;
        }
        
        this.end_func = end_func;

        this.loop = false;
        this.is_playing = true;
    },

    update (dt) {
        if(!this.is_playing){
            return;
        }

        this.play_time += dt;
        var index = Math.floor(this.play_time / this.duration);

        // 非循环播放
        if(!this.loop){
            if(index >= this.sprite_frames.length){ // 结束了
                this.is_playing = false;
                if(this.end_func){
                    this.end_func();
                }
            }else{
                this.sprite.SpriteFrame = this.sprite_frames[index];
            }
        }else{
            while(index >= this.sprite_frames.length){
                index -= this.sprite_frames.length;
                this.play_time -= (this.sprite_frames.length * this.duration);
            }
            this.sprite.SpriteFrame = this.sprite_frames[index];
        }
    },
});
