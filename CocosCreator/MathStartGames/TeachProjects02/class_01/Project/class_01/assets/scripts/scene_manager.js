// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var global_var = require('global_var');
var sound_mgr = require("./sound_manager");
var scene_manager = cc.Class({
    extends: cc.Component,

    properties: {
        curr_index: -1,
        answer_list: [],
        is_send: false
    },

    // LIFE-CYCLE CALLBACKS:
    ctor: function() {
        this.answer_list = [];
    },

    init_answer_list: function() {
        for (let i = 0; i < global_var.list.length; i++) {
            this.answer_list[i] = { res: 0 };
        }
    },
    checkResult(index) {
        var res = this.answer_list[index].res;
        var trueAns = global_var.list[index].result; // 答案
        var checkRes = 0;
        if (res === trueAns) {
            checkRes = 0;
        } else {
            checkRes = res > trueAns ? 1 : -1;
        }
        return checkRes;
    },
    submitAnswer(index, result) {
        this.answer_list[index - 1] = { res: result };
        return this.checkResult(index - 1);
    },
    gotoNextTitle() {
        if (this.is_over) {
            return;
        }

        this.curr_index = this.curr_index + 1;
        var next_index = this.curr_index;

        if (global_var.list[next_index]) {
            cc.director.loadScene(global_var.list[next_index].scene);
            sound_mgr.getInstance().set_music_volume();
        } else {
            this.is_over = true;
            // gameover
            this.curr_index = -1;
        }
    },
    // 发送结果
    sendResAnswer() {
        if (this.is_send == true) {
            return;
        }
        this.is_send = true;
        this.sendRequest("studentReport", this.answer_list);
    },
    // iframe通信
    sendRequest(type, info) {
        console.log("==========游戏内发送数据");
        var requestObj = {}
        if (type == "teacherReport") {
            requestObj = {
                status: global_var.msg_sign.teacher_ready,
                type: type,
                list: info
            }
        } else if (type == "studentReport") {
            requestObj = {
                status: global_var.msg_sign.game_end,
                type: type,
                list: info
            }
        } else if (type == "loadingEnd") {
            requestObj = {
                status: global_var.msg_sign.loading_end,
                type: type,
                list: info
            }
        }
        this.sendMessage(requestObj);
    },
    sendMessage(obj) {
        parent.iframeEvent(obj);
    },

    // 重玩
    replay() {
        this.is_send = false;
        this.is_over = false;
        this.curr_index = -1;
        this.answer_list = [];
        this.init_answer_list();
        this.gotoNextTitle();
    },
    // update (dt) {},
});

scene_manager._instance = null;
scene_manager.getInstance = function() {
    if (!scene_manager._instance) {
        scene_manager._instance = new scene_manager();
    }
    return scene_manager._instance;
}