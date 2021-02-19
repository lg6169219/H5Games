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
        rot_time: 4,
    },

    // use this for initialization
    onLoad: function () {
        var rot = cc.rotateBy(this.rot_time, 360);
        var rf = cc.repeatForever(rot);
        this.node.runAction(rf);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
