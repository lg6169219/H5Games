let is_teacher = false;

let list = [
    { scene: "game_scene01", dividend: 12, divisor: 3, res: 4 },
    { scene: "game_scene02", dividend: 10, divisor: 2, res: 5 },
    { scene: "game_scene03", dividend: 9, divisor: 3, res: 3 },
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