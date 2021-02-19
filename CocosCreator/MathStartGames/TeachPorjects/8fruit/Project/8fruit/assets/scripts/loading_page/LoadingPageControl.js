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
        progressBar : {
            default : null,
            type : cc.ProgressBar
        },
        loadingTipsLabel : {
            default : null,
            type : cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {    
        var self = this;
        window.iframeEvent = function(obj){
            console.log("内部界面接收的消息AA");
            console.log(obj);
            if (obj.goodsSum){
                var globalVar = require('GlobalVar');
                globalVar.lifeCount = obj.goodsSum;
            }
        }
    },
    start() {
        var GameResourceLoader = require("GameLoader")
        this.progressBar.totalLength = this.progressBar.node.width;
        this.progressBar.progress = 0;

        if (!GameResourceLoader.isLoaded()) {
            GameResourceLoader.load({
                success: () => {
                    // 游戏资源加载成功之后
                    // 1. 读取游戏配置文件
                    this.initGameConfig();
                },
                fail: () => {
                    this.loadingTipsLabel.string = `喔噢，游戏加载失败了`;
                },
                onProgress: (
                    /**
                     * 加载进度[0,1]
                     */
                    percent
                ) => {
                    this.progressBar.progress = percent;
                    this.loadingTipsLabel.string = `正在努力加载中 ${Math.floor(percent * 100)}%`;
                }
            });
        }
    },
    /**
     *  初始化游戏配置
     */
    initGameConfig() {
        // this.globalVar = this.globalVar || require('../GlobalVar');
        // var self = this;
        // // 这里使用的self 防止作用域改变
        // cc.loader.loadRes('config/gameresconfig', function(err, object){
        //     if(err){
        //         console.log(err);
        //         return;
        //     }

        //     self.globalVar.gameResConfig = object.json;

        //     // 2. 打开场景
        //     cc.director.loadScene("StartScene");
        // });

        // 2. 打开场景
        cc.director.loadScene("game_scene");
    }
    // update (dt) {},

    // //预加载主游戏页面图片资源数组
    // findRes(jsonData) {
    //     for (let key in jsonData) {
    //         if (typeof jsonData[key] == "string") {
    //             if (key == "progressdi" || key == "progressshang" || key == "loadbg") {
    //                 this.preres.push(jsonData[key]);
    //             } else {
    //                 var s = jsonData[key].split("/");
    //                 if (s.length && s.length > 1) {
    //                     this.res.push(jsonData[key]);
    //                 }
    //             }
    //         } else if (typeof jsonData[key] == "object") {
    //             this.findRes(jsonData[key]);
    //         }
    //     }
    // }
});
