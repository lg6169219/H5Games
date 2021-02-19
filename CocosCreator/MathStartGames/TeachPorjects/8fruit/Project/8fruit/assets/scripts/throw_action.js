cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        g: -1000,
        play_onload: false,
    },

    // use this for initialization
    onLoad: function () {
        this.action_started = false;
    },
    
    start_action: function(vx, vy, g) {
        this.action_started = true;
        this.vx = vx;
        this.vy = vy;

        this.g = g;
        // this._speed = cc.v2(0, 250).mul(4);

        // cc.director.getScheduler().setTimeScale(10);
    },
    
    stop_action: function() {
        this.action_started = false;
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.action_started === false) {
            return;
        }

        var sx = this.vx * dt;
        var sy = this.vy * dt + 0.5 * this.g * dt * dt;
        this.vy += this.g * dt;
        
        this.node.x += sx;
        this.node.y += sy;


        // this._speed = this._speed.add(cc.v2(0, this.g * dt));
        // this.node.position = this.node.position.add(this._speed.mul(dt));
    },
});
