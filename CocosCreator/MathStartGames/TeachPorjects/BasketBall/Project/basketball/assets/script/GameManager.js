var Basket = require('Basket');
var Ball = require('Ball');
var Score = require('Score');
var LifeCount = require('LifeCount');
var Player = require('player');
var SoundManager = require('SoundManager');
var TimeManager = require('TimeManager');

cc.Class({
    extends: cc.Component,

    properties: {
        ball: cc.Prefab,
        basket: Basket,
        startPosition: cc.Vec2,
        score: Score,
        lifeCount: LifeCount,
        soundMng: SoundManager,
        timeMng: TimeManager,
        player: Player,
        startNode: {
            type: cc.Node,
            default: null
        },
        ballInPfx: {
            type: cc.Node,
            default: null
        },
        tishiNode: {
            type: cc.Node,
            default: null
        }
    },

    onLoad: function() {
        this.startNode.active = true;
    },
    // iframe通信
    sendRequest() {
        console.log("==========内部request");
        var requestObj = {
            status: 0,
            type: "call",
        }
        this.sendMessage(requestObj);
    },
    sendMessage(obj) {
        parent.iframeEvent(obj);
    },
    start: function() {
        var self = this;
        window.iframeEvent = function(obj) {
            console.log("内部界面接收的消息BB");
            console.log(obj);
            if (obj.goodsSum) {
                var globalVar = require('./global_var/GlobalVar');
                globalVar.lifeCount = obj.goodsSum;
            }
        }
        this.sendRequest();

        this.soundMng.playBgSound();
    },

    onGameStart: function() {
        this.startNode.active = false;

        this.ballPool = new cc.NodePool('Ball');
        // 初始化玩家
        this.initPlayer();
        // this.newBall();
        this.initCollisionSys();
        this.basket.init(this);
        this.score.init(this);
        this.timeMng.init(this);

        this.timeMng.oneSchedule();

        this.score.setScore(0);

        var globalVar = require('./global_var/GlobalVar');
        this.lifeCount.setCount(globalVar.lifeCount);
    },

    // 初始化碰撞系统
    initCollisionSys: function() {
        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        // this.collisionManager.enabledDebugDraw = true// 开启debug绘制

        // cc.debug.setDisplayStats(true);
    },
    initPlayer: function() {
        this.player.init(this);
    },
    shootBall: function(percent) {
        this.tishiNode.active = false;

        var globalVar = require('./global_var/GlobalVar');
        if (globalVar.lifeCount <= 0) {
            return;
        }

        globalVar.lifeCount = globalVar.lifeCount - 1;
        globalVar.lifeCount = Math.max(0, globalVar.lifeCount);
        this.lifeCount.setCount(globalVar.lifeCount);

        if (globalVar.lifeCount === 0) {
            this.scheduleOnce(this.gameOver, 1.5);
        }

        this.newBall(percent);
    },

    playBallInpfx: function() {
        var pfxAnima = this.ballInPfx.getComponent("frame_anima");
        pfxAnima.play_once();
    },
    // 生成篮球
    newBall: function(percent) {
        var child = null;
        if (this.ballPool.size() > 0) {
            child = this.ballPool.get(this);
        } else {
            child = cc.instantiate(this.ball);
        }

        child.zIndex = 1;
        this.node.addChild(child);
        child.setPosition(this.startPosition);
        var ballComp = child.getComponent('Ball');
        ballComp.init(this, percent); // 启动篮球逻辑
        // this.newShadow(ballComp);
    },
    // 生成角色
    newPlayer: function() {

    },
    // newShadow: function(ball){
    //     var ballShadow = null;
    //     if(cc.js.Pool.hasObject(Shadow)){
    //         ballShadow = cc.js.Pool.getFromPool(Shadow).node;
    //     }else{
    //         ballShadow = cc.instantiate(this.shadow);
    //     }

    //     ballShadow.setLocalZOrder(2);
    //     this.node.addChild(ballShadow);
    //     ballShadow.setPosition(this.startPosition);
    //     var shadowComp = ballShadow.getComponent('Shadow')
    //     ball.bindShadow(shadowComp);
    //     shadowComp.init(this); // 启动影子逻辑
    // },

    startMoveBasket: function() {
        this.basket.startMove();
    },

    stopMoveBasket: function() {
        this.basket.stopMove();
    },

    // iframe通信
    sendEndRequest() {
        var requestObj = {
            status: 2,
        }
        this.sendMessage(requestObj);
    },

    // 游戏结束
    gameOver: function() {
        if (this.isGameOver) {
            return;
        }
        this.soundMng.stopBgSound();

        this.soundMng.playEndSound();

        this.isGameOver = true;
        var score = this.score.getScore();
        var globalVar = require('./global_var/GlobalVar');
        globalVar.finalScore = score;

        cc.director.loadScene("OverScene");

        this.scheduleOnce(this.sendEndRequest, 2);
    },
});