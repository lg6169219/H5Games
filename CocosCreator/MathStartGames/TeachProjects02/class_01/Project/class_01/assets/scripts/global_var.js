let is_teacher = -1;

let list = [
    { scene: "game_scene01", content1_left: 1, content1_right: 3, content2_left: 2, content2_right: 4, content3_left: 1, content3_right: 1, result: 5 },
    { scene: "game_scene02", content1_left: 2, content1_right: 4, content2_left: 6, result: 3 },
    { scene: "game_scene03", content1_left: 2, content1_right: 3, content2_left: 6, result: 4 },
];

// paramName
function get_url_param(paramName) {
    var url = window.location.href.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (let i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");
            if (arr != null && arr[0] == paramName) {
                return arr[1];
            }
        }
        return "";
    } else {
        return "";
    }
};

let msg_sign = {
    loading: 100,
    loading_end: 101,
    waiting_start: 200,
    teacher_ready: 201,
    game_start: 300,
    game_end: 400
};

module.exports = {
    is_teacher,
    list,
    get_url_param,
    msg_sign
}