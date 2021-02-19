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
    start () {
        var self = this;
        window.iframeEvent = function(obj){
            console.log("内部界面接收的消息BB");
            console.log(obj);
            if (obj.goodsSum){
                self.globalVar = self.globalVar || require('GlobalVar');
                self.globalVar.hammerNum = obj.goodsSum;
            }
        }

        this.globalVar = require('GlobalVar');

        this.sendRequest();
        this.showStartBtn();

        this.showAudioBtn();
    },
    showStartBtn(){
        var buttonStartNode = this.node.getChildByName("ButtonStart");
        buttonStartNode.on(cc.Node.EventType.TOUCH_START, this.startGame, this);
    },
    showAudioBtn(){
        var audioButtonNode = this.node.getChildByName("AudioButton");
        audioButtonNode.getComponent("AudioButton").showButton();
    },
    startGame(){
        cc.director.loadScene("GameScene");
    }
    // update (dt) {},
});
