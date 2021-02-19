cc.Class({
    extends: cc.Component,

    properties: {
        maxTime: 0,
        timeToMove: 0,
    },

    init: function (game) {
        this.game = game;
        this.time = this.maxTime;
        this.isTimeToMove = false;
    },

    _callback: function(){
        if (!this.counting){
            return;
        }
        this.counting = false;
        this.game.basket.count.string = '00  00';
        // this.game.stopMoveBasket();
        this.game.gameOver();
    },

    addTime: function(time){
        this.time += time;
    },

    stopCounting: function () {
        // this.unschedule(this._callback);
        this.time = this.maxTime;
    },

    oneSchedule: function () {
        this.stopCounting();
        // this.scheduleOnce(this._callback, this.maxTime);
        this.counting = true;
    },

    // called every frame
    update: function (dt) {
        if (this.counting && this.time > 0) {
            this.time -= dt;
            if(this.maxTime - this.timeToMove >= this.time && !this.isTimeToMove){
                this.isTimeToMove = true;
                this.game.startMoveBasket();
            }

            let text = this.time.toFixed(2)
            if(text.length === 4){
                text = '0'+text;
            }
            this.game.basket.count.string = text.replace('.', '  ');
            if (this.time <= 0){
                this._callback();
            }
        }
    },
});
