cc.Class({
    extends: cc.Component,

    properties: {
        scoreText: cc.Label,
    },

    init: function (game) {
        this.game = game;
        this._count = 0;
    },
    
    // 获取分数
    getCount: function(){
        return _count;
    },
   
    // 设置分数
    setCount: function(count){
        this._count = count;
        this._updateCount();
    },
    
    // 增加分数
    subCount: function(){
        this._count -= 1;
        this._count = Math.max(0, this._count);
        this._updateCount();
    },
    
    // 更新分数
    _updateCount: function(){
        this.scoreText.string = this._count;
    },
});
