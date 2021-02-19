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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameTime = 180; //游戏时间180秒
        this.curTime = 0; //当前进行时间
        this.gameStop = false; // 游戏结束
        this.gameStart = false; // 游戏开始
        this.isChangeGameSpeed = false;
        this.showMoleLoopTime = 1;
        this.lastBeatType = 0
    },

    start () {
        this.globalVar = require("GlobalVar");

        var dishuContentCfg = this.globalVar.gameResConfig.game_content.dishu_content;
        this.beatList = [];
        for (let i = 1; i < 5; i++){
            if (dishuContentCfg["btn_dishu" + i] != null){
                this.beatList.push({type : i, targetname : dishuContentCfg["btn_dishu" + i].targetname, audio : dishuContentCfg["btn_dishu" + i].audio_content});
            }
        }

        this.gameStart = true;

        this.showNumLabel(this.globalVar.hammerNum);

        this.randomBeatTarget();

        this.showMelos();
        this.bindHammer();

        this.schedule(this.onLoop, this.showMoleLoopTime);      

        this.schedule(this.onChangeTargetLoop, 8);    
    },

    showMelos(){
        for (let i = 0; i < this.globalVar.moleNum; i++){
            var index = i + 1;
            var moleNode = this.node.getChildByName("DishuNode" + index);
            moleNode.getComponent('Mole').game = this;
        }
    },
    
    updateLabelResult(isRight){
        var labelResultNode = this.node.getChildByName("LabelResult");
        var labelResult = labelResultNode.getComponent(cc.Label);
        var str = isRight ? "恭喜你，击中了目标！" : "很遗憾，你打错啦！";
        var colorStr = isRight ? "#2d630f" : "#ff0000";
        var color = cc.Color.BLACK;     
        labelResultNode.color = color.fromHEX(colorStr);
        labelResult.string = str;

        if(isRight){
            var socreLabelNode = this.node.getChildByName("SocreLabel");
            var socreComp = socreLabelNode.getComponent("Score");
            socreComp.addScore();
        }
    },
    
    checkChangeTarget(){
        this.randomBeatTarget();
    },

    randomBeatTarget : function(){
        this.randomList = this.randomList || this.beatList.slice(0);
        let beatIndex = Math.floor(Math.random() * this.randomList.length);
        this.lastBeatType = this.beatTarget ? this.beatTarget.type : 0;
        this.beatTarget = this.randomList[beatIndex];
        this.randomList.splice(beatIndex, 1);
        if(this.randomList.length === 0){
            this.randomList = this.beatList.slice(0);  
        }

        var labelTargetNode = this.node.getChildByName("LabelTarget");
        var labelTarget = labelTargetNode.getComponent(cc.Label);
        labelTarget.string = "去打" + this.beatTarget.targetname;

        var labelResultNode = this.node.getChildByName("LabelResult");
        var labelResult = labelResultNode.getComponent(cc.Label);
        labelResult.string = "";

        if (this.beatTarget.audio){
            cc.audioEngine.setEffectsVolume(this.beatTarget.audio.audioVolume);
            cc.loader.loadRes(this.beatTarget.audio.res, cc.AudioClip, function(err, audioClip){
                cc.audioEngine.playEffect(audioClip);
            });
        }
    },

    // 切换目标计时器
    onChangeTargetLoop(){
        this.checkChangeTarget();
    },

    // 地鼠显示计时器
    onLoop(){
        var index = Math.floor(Math.random()*5) + 1;
        var type = 0;
        if (this.beatTarget){
            var rand1 = Math.random() < 0.5 ? true : false;
            if(rand1){
                type = this.beatTarget.type; 
            }
        }
        if(type === 0){
            type = Math.floor(Math.random()* this.beatList.length) + 1;
        }
        var mole = this.node.getChildByName("DishuNode" + index);
        mole.getComponent('Mole').type = type;
        mole.getComponent('Mole').loadRes();
    },
    // 加快游戏速度
    changeGameSpeed(){
        if (this.isChangeGameSpeed){
            return;
        }

        this.isChangeGameSpeed = true;
        this.unschedule(this.onLoop);
        this.showMoleLoopTime = 0.6;

        this.schedule(this.onLoop, this.showMoleLoopTime);
    },
    // 锤子个数
    showNumLabel : function(num){
        var labelNode = this.node.getChildByName("HammerNumLabel");
        var label = labelNode.getComponent(cc.Label);
        num = Math.max(0, num);
        label.string = num;

        if (this.globalVar.hammerNum <= 0){
            this.gameOver();
        }
    },

    // iframe通信
    sendRequest(){
        var requestObj = {
            status:2,
        }
        this.sendMessage(requestObj);
    },
    sendMessage(obj){
        parent.iframeEvent(obj);
    },

    // 游戏结束
    gameOver(){
        if (this.gameStop){
            return;
        }

        this.gameStop = true;

        // 获取分数
        var socreLabelNode = this.node.getChildByName("SocreLabel");
        var socreComp = socreLabelNode.getComponent("Score");
        var s = socreComp.getScore();
        var globalVar = require("GlobalVar");
        globalVar.finalScore = s;

        this.unschedule(this.onLoop);

        this.unschedule(this.onChangeTargetLoop);

        this.scheduleOnce(this.gameEnd, 1.5);

        this.scheduleOnce(this.sendMessage, 3.5);
    },

    // 切换结束场景
    gameEnd(){
        cc.audioEngine.stopAll();
  
        cc.audioEngine.setEffectsVolume(this.globalVar.gameResConfig.game_sound.audio_end.audioVolume);
        cc.loader.loadRes(this.globalVar.gameResConfig.game_sound.audio_end.res, cc.AudioClip, function(err, audioClip){
            cc.audioEngine.playEffect(audioClip);
        });

        cc.director.loadScene('OverScene');
    },
    bindHammer(){
        var hammerSpriteNode = this.node.getChildByName("HammerSprite");
        // var animation = hammerSpriteNode.getComponent(cc.Animation);
        hammerSpriteNode.getComponent("Hammer").game = this;
    },
    showHammer(){
        var hammerSpriteNode = this.node.getChildByName("HammerSprite");
        var animation = hammerSpriteNode.getComponent(cc.Animation);
        if (cc.sys.isMobile){
            hammerSpriteNode.active = false;
            this.node.on(cc.Node.EventType.TOUCH_START, this.hammerTap, this);
            animation.on(cc.Animation.EventType.FINISHED, this.hammerHide, this);
        }else{
            hammerSpriteNode.active = true;
            this.node.on(cc.Node.EventType.MOUSE_MOVE, this.hammerMove, this);
            this.node.on(cc.Node.EventType.TOUCH_START, this.hammerDown, this);
        }

    },
    hammerMove(e){
        var temp = e.getLocation();
        var hammer = this.node.getChildByName("HammerSprite");
        var tempPlayer = hammer.parent.convertToNodeSpaceAR(temp);
        hammer.setPosition(tempPlayer);
    },
    hammerPCAnima(){
        var hammerSpriteNode = this.node.getChildByName("HammerSprite");
        var animation = hammerSpriteNode.getComponent(cc.Animation);
        animation.play("animate_play");
    },
    hammerMobileAnima(e){
        var temp = e.getLocation();
        var hammerSpriteNode = this.node.getChildByName("HammerSprite");
        hammerSpriteNode.active = true;

        var tempPlayer = hammerSpriteNode.parent.convertToNodeSpaceAR(temp);
        hammerSpriteNode.setPosition(tempPlayer);

        var animation = hammerSpriteNode.getComponent(cc.Animation);
        animation.play("animate_play");
    },

    hammerDown(){
        this.hammerPCAnima();

        this.subHammerNum();
    },
    subHammerNum(){
        this.globalVar.hammerNum -= 1;
        if (this.globalVar.hammerNum <= 0){
            this.globalVar.hammerNum = 0;
        }
        this.showNumLabel(this.globalVar.hammerNum);
    },
    hammerTap(e){
        this.hammerMobileAnima(e);

        this.subHammerNum();
    },
    hammerHide(){
        var hammerSpriteNode = this.node.getChildByName("HammerSprite");
        hammerSpriteNode.active = false;
    },
    update (dt) {
        if (!this.gameStart || this.gameStop){
            return;
        }
        
        this.curTime += dt;

        if (this.curTime >= 60){
            this.changeGameSpeed();
        }

        var lastTime = this.gameTime - this.curTime;
        var per = lastTime / this.gameTime;

        var timeProgressBarNode = this.node.getChildByName("TimeProgressBar");
        var progres = timeProgressBarNode.getComponent(cc.ProgressBar);
        progres.totalLength = timeProgressBarNode.width;
        progres.progress = per;

        var timeLabelNode = timeProgressBarNode.getChildByName("TimeLabel").getComponent(cc.Label);
        timeLabelNode.string = "倒计时：" + Math.ceil(lastTime) + "秒";

        if (lastTime <= 0){
            this.gameOver();
        }
    },
});
