"use strict";
cc._RF.push(module, 'c0f2bwqJUlODYEk6tdJFU1N', 'EndGame');
// scripts/EndGame.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

    // onLoad () {},

    start: function start() {
        var globalVar = require('GlobalVar');

        var contentLabelNode = this.node.getChildByName("contentLabel");
        contentLabelNode.getComponent(cc.RichText).string = "<color=#000000>\u672C\u6B21\u6E38\u620F\u83B7\u5F97<color=#892c11>" + globalVar.finalScore + "</color>\u5206</color>";

        var scoreLabelNode = this.node.getChildByName("scoreLabel");
        scoreLabelNode.getComponent(cc.RichText).string = "<p align = 'left'><color=#000000>\u606D\u559C\u83B7\u5F97<color=#892c11>" + Math.floor(globalVar.finalScore / 5) + "</color>\u4E2A</color></p>";

        var damuge1Node = this.node.getChildByName("damuge1");
        damuge1Node.x = scoreLabelNode.x + scoreLabelNode.width + 40;
    }
    // update (dt) {},

});

cc._RF.pop();