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
        node_mask: {
            default: null,
            type: cc.Node
        },
        node_content: {
            default: null,
            type: cc.Node
        },
        mask_opacity: 128,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var winSize = cc.view.getVisibleSize();
        this.node.setPosition(0, -winSize.height / 2 - 100);
        // this.node.active = false;
    },

    start() {
        // node_content/node_btn/btn_1
        this.show_dlg();
    },

    show_dlg: function(fly_pos_y) {
        // 渐显的方式
        // this.node_mask.opacity = 0;
        // var fin = cc.fadeIn(0.3, this.mask_opacity);
        // this.node_mask.runAction(fin);

        // this.node_content.scale = 0;
        // var s = cc.scaleTo(0.4, 1).easing(cc.easeBackOut());
        // this.node_content.runAction(s);

        // 飞入的方式
        this.node.active = true;
        console.log("=============ffff");
        this.node.opacity = 0;
        var fin = cc.fadeIn(0.3, this.mask_opacity);
        this.node.runAction(fin);

        var mov = cc.moveTo(0.4, cc.v2(0, -250));
        this.node.runAction(mov);

        this.node_mask.on(cc.Node.EventType.TOUCH_START, function(){
            this.hide_dlg();
        }.bind(this), this);
        this.node_mask.on(cc.Node.EventType.TOUCH_MOVE, function(){

        }.bind(this), this);
        this.node_mask.on(cc.Node.EventType.TOUCH_END, function(){

        }.bind(this), this);
        this.node_mask.on(cc.Node.EventType.TOUCH_CANCEL, function(){

        }.bind(this), this);
    },
    // UI内容
    load_content: function() {
        var node_btns = this.node_content.getChildByName("node_btn");
        for (let i = 0; i < 10; i++) {
            var btn = node_btns.getChildByName("btn_" + i);
            btn.on(cc.Node.EventType.TOUCH_END, function() {

            }.bind(this), this);
        }
        node_btn.getChildByName("node")
    },
    hide_dlg: function() {
        var winSize = cc.view.getVisibleSize();
        this.node.setPosition(0, -winSize.height / 2 - 100);
        this.node.active = false;
    },
    // update (dt) {},
});