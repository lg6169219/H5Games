(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0486fOqHrJN+6c5PQg5FHh9', 'Game', __filename);
// scripts/Game.js

'use strict';

var Player = require('Player');
var ScoreFX = require('ScoreFX');
var Star = require('Star');

var Game = cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        boomPrefab: {
            default: null,
            type: cc.Prefab
        },
        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // // 地面节点，用于确定星星生成的高度
        // ground: {
        //     default: null,
        //     type: cc.Node
        // },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: Player
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // life label 的引用
        lifeDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        // 爆炸音效资源
        boomAudio: {
            default: null,
            type: cc.AudioClip
        },
        btnNode: {
            default: null,
            type: cc.Node
        },
        startBgNode: {
            default: null,
            type: cc.Node
        },
        controlHintLabel: {
            default: null,
            type: cc.Label
        },
        keyboardHint: {
            default: '',
            multiline: true
        },
        touchHint: {
            default: '',
            multiline: true
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        // 获取地平面的 y 轴坐标
        this.groundY = -350;

        // store last star's x position
        this.currentStar = null;
        this.currentStarX = 0;

        this.currentBoom = null;
        this.currentBoomX = 0;

        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;

        // is showing menu or running game
        this.enabled = false;

        // initialize control hint
        var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlHintLabel.string = hintText;

        // initialize star and score pool
        this.starPool = new cc.NodePool('Star');
        this.boomPool = new cc.NodePool('Boom');
        this.scorePool = new cc.NodePool('ScoreFX');

        var globalVar = require("GlobalVar");
        this.life_count = globalVar.lifeCount;
    },

    // iframe通信
    sendRequest: function sendRequest() {
        console.log("==========内部request");
        var requestObj = {
            status: 0,
            type: "call"
        };
        this.sendMessage(requestObj);
    },
    sendMessage: function sendMessage(obj) {
        parent.iframeEvent(obj);
    },


    start: function start() {
        var self = this;
        window.iframeEvent = function (obj) {
            console.log("内部界面接收的消息BB");
            console.log(obj);
            if (obj.goodsSum) {
                var globalVar = require('GlobalVar');
                globalVar.lifeCount = obj.goodsSum;
                self.life_count = globalVar.lifeCount;
            }
        };
        this.sendRequest();
    },
    onStartGame: function onStartGame() {
        // 初始化计分
        this.resetScore();
        this.showLife();
        // set game state to running
        this.enabled = true;
        // set button and gameover text out of screen
        this.btnNode.active = false;
        this.startBgNode.active = false;
        // reset player position and move speed
        this.player.startMoveAt(cc.v2(0, this.groundY));
        // 检查是否更新玩家的体型和游戏难度
        this.player.changePlayerSize(this.score);

        var s = this.player.getComponent(cc.Sprite);
        s.enabled = false;

        // spawn star
        this.spawnNewStar();
        // 地雷
        this.randomwCreateBoom();
    },

    spawnNewStar: function spawnNewStar() {
        var newStar = null;
        // 使用给定的模板在场景中生成一个新节点
        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this); // this will be passed to Star's reuse method
        } else {
            newStar = cc.instantiate(this.starPrefab);
        }
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // pass Game instance to star
        newStar.getComponent('Star').init(this);
        // start star timer and store star reference
        this.startTimer();
        this.currentStar = newStar;
    },

    despawnStar: function despawnStar(star) {
        this.starPool.put(star);
        this.spawnNewStar();
        this.despawnBoom();
    },


    getNewBoomPosition: function getNewBoomPosition() {
        // if there's no star, set a random x pos
        if (!this.currentBoom) {
            this.currentBoomX = (Math.random() - 0.5) * 2 * this.node.width / 2;
        }
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + Math.random() * this.player.jumpHeight / 2;
        randY = Math.max(randY, -300);
        // 根据屏幕宽度和上一个星星的 x 坐标，随机得到一个新生成星星 x 坐标
        var maxX = this.node.width / 2 - 50;
        if (this.player.node && this.player.node.x > 0) {
            randX = -Math.random() * maxX;
        } else {
            randX = Math.random() * maxX;
        }

        if (this.currentStarX && Math.abs(this.currentStarX - randX) < 100) {

            if (this.currentStarX > randX) {
                randX = randX - 100;
            } else {
                randX = randX + 100;
            }
            randX = Math.max(randX, -maxX);
            randX = Math.min(randX, maxX);
        }

        // this.currentBoomX = randX;
        // 返回地雷坐标
        return cc.v2(randX, randY);
    },

    randomwCreateBoom: function randomwCreateBoom() {
        var randomVal = Math.random() >= 0.5 ? true : false;
        if (randomVal) {
            this.spawnNewBoom();
        }
    },

    spawnNewBoom: function spawnNewBoom() {
        var newBoom = null;
        // 使用给定的模板在场景中生成一个新节点
        if (this.boomPool.size() > 0) {
            newBoom = this.boomPool.get(this); // this will be passed to Star's reuse method
        } else {
            newBoom = cc.instantiate(this.boomPrefab);
        }

        newBoom.getComponent(cc.Sprite).enabled = true;

        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newBoom);
        // 为星星设置一个随机位置
        newBoom.setPosition(this.getNewBoomPosition());
        // pass Game instance to star
        newBoom.getComponent('Boom').init(this);
        // // start star timer and store star reference
        // this.startTimer();
        this.currentBoom = newBoom;
    },

    despawnBoom: function despawnBoom() {
        if (this.currentBoom) {
            this.boomPool.put(this.currentBoom);
            this.currentBoom = null;
        }

        this.randomwCreateBoom();
    },


    startTimer: function startTimer() {
        // get a life duration for next star
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function getNewStarPosition() {
        // if there's no star, set a random x pos
        if (!this.currentStar) {
            this.currentStarX = (Math.random() - 0.5) * 2 * this.node.width / 2;
        }
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + Math.random() * this.player.jumpHeight + 50;
        randY = Math.max(randY, -300);
        // 根据屏幕宽度和上一个星星的 x 坐标，随机得到一个新生成星星 x 坐标
        var maxX = this.node.width / 2 - 50;
        if (this.currentStarX >= 0) {
            randX = -Math.random() * maxX;
        } else {
            randX = Math.random() * maxX;
        }
        this.currentStarX = randX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    gainLife: function gainLife(pos) {
        this.life_count -= 1;
        this.life_count = Math.max(0, this.life_count);
        // 更新 lifeDisplay Label 的文字
        this.showLife();

        if (this.life_count <= 0) {
            this.gameOver();
        }
    },

    showLife: function showLife() {
        this.lifeDisplay.string = this.life_count.toString();
    },

    gainScore: function gainScore(pos) {
        this.score += 1;
        // 检查是否更新玩家的体型和游戏难度
        this.player.changePlayerSize(this.score);
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放特效
        var fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(pos);
        fx.play();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    resetScore: function resetScore() {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    spawnScoreFX: function spawnScoreFX() {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx.getComponent('ScoreFX');
        } else {
            fx = cc.instantiate(this.scoreFXPrefab).getComponent('ScoreFX');
            fx.init(this);
            return fx;
        }
    },

    despawnScoreFX: function despawnScoreFX(scoreFX) {
        this.scorePool.put(scoreFX);
    },


    // called every frame
    update: function update(dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            this.enabled = false; // disable this to avoid gameOver() repeatedly
            return;
        }
        this.timer += dt;
    },

    // iframe通信
    sendEndRequest: function sendEndRequest() {
        var requestObj = {
            status: 2
        };
        this.sendMessage(requestObj);
    },


    gameOver: function gameOver() {
        var globalVar = require('GlobalVar');
        globalVar.finalScore = this.score;

        this.player.enabled = false;
        this.player.stopMove();
        this.currentStar.destroy();
        if (this.currentBoom) {
            this.currentBoom.destroy();
            this.currentBoom = null;
        }
        cc.director.loadScene("OverScene");

        this.scheduleOnce(this.sendEndRequest, 3);
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Game.js.map
        