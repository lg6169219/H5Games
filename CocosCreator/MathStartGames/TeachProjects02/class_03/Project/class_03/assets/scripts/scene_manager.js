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
var sound_mgr = require("sound_manager");
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
            this.answer_list[i] = { res: false };
        }
    },
    checkResult(index, check_num2) {
        var res = this.answer_list[index - 1];
        var true_ans = global_var.list[index - 1]; // 答案
        var check_res = false;
        if (!res.res1 && !res.res2) {
            return check_res;
        }
        // { scene: "game_scene01", dividend: 12, divisor: 3, res: 4 },
        var temp1 = false;
        if (res.res1 && res.res1.dividend === true_ans.dividend && res.res1.divisor === true_ans.divisor) {
            var max = Math.max.apply(null, res.res1.res);
            var min = Math.min.apply(null, res.res1.res);
            if (max === true_ans.res && min === true_ans.res) {
                temp1 = true;
            }
        }

        var temp2 = check_num2 === true ? false : true;
        if (check_num2 && res.res2 && res.res2.dividend === true_ans.dividend && res.res2.divisor === true_ans.divisor && res.res2.res === true_ans.res) {
            temp2 = true;
        }

        return (temp1 === true && temp2 === true);
    },
    submitAnswer(index, result, result2, check_num2) {
        // result = {dividend: 12, divisor: 3, res: 4}
        this.answer_list[index - 1] = { res1: result, res2: result2 };
        let res = this.checkResult(index, check_num2);
        this.answer_list[index - 1] = { res: res };

        // if (!global_var.list[this.curr_index + 1]) {
        //     this.sendResAnswer();
        // }
        return res;
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
    set_click_effect: function(effect) {
        this.curr_click_effect = effect;
    },
    play_click_effect: function() {
        if (this.curr_click_effect != null) {
            sound_mgr.getInstance().play_effect(this.curr_click_effect);
        }
    },
});

scene_manager._instance = null;
scene_manager.getInstance = function() {
    if (!scene_manager._instance) {
        scene_manager._instance = new scene_manager();
    }
    return scene_manager._instance;
}