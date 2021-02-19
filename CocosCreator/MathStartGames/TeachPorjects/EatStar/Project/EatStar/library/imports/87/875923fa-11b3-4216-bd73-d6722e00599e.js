"use strict";
cc._RF.push(module, '87592P6EbNCFr1z1nIuAFme', 'LoadingPageControl');
// scripts/loading_page/LoadingPageControl.js

"use strict";

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
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },
        loadingTipsLabel: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function onLoad() {
        var self = this;
        console.log("=========AAAA");
        window.iframeEvent = function (obj) {
            console.log("内部界面接收的消息AA");
            console.log(obj);
            if (obj.goodsSum) {
                console.log(self.globalVar);
                self.globalVar = self.globalVar || require('GlobalVar');
                self.globalVar.hammerNum = obj.goodsSum;
            }
        };
    },
    start: function start() {
        var _this = this;

        var GameResourceLoader = require("GameLoader");
        this.progressBar.totalLength = this.progressBar.node.width;
        this.progressBar.progress = 0;

        if (!GameResourceLoader.isLoaded()) {
            GameResourceLoader.load({
                success: function success() {
                    // 游戏资源加载成功之后
                    // 1. 读取游戏配置文件
                    _this.initGameConfig();
                },
                fail: function fail() {
                    _this.loadingTipsLabel.string = "\u5594\u5662\uFF0C\u6E38\u620F\u52A0\u8F7D\u5931\u8D25\u4E86";
                },
                onProgress: function onProgress(
                /**
                 * 加载进度[0,1]
                 */
                percent) {
                    _this.progressBar.progress = percent;
                    _this.loadingTipsLabel.string = "\u6B63\u5728\u52AA\u529B\u52A0\u8F7D\u4E2D " + Math.floor(percent * 100) + "%";
                }
            });
        }
    },

    /**
     *  初始化游戏配置
     */
    initGameConfig: function initGameConfig() {
        cc.director.loadScene("game");
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

cc._RF.pop();