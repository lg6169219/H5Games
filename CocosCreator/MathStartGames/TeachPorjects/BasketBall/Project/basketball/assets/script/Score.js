cc.Class({
    extends: cc.Component,

    properties: {
        scoreText: cc.Label,
    },

    init: function (game) {
        this.game = game;
        this._score = 0;
    },
    
    // 获取分数
    getScore: function(){
        return this._score;
    },
   
    // 设置分数
    setScore: function(score){
        this._score = score;
        this._updateScore();
    },
    
    // 增加分数
    addScore: function(){
        this._score += 1;
        this._updateScore();
        
        //this.game.soundMng.playScoreSound();
    },
    
    // 更新分数
    _updateScore: function(){
        this.node.getComponent(cc.Label).string = "Score:" + this._score;
    },
});
