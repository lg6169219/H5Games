let is_teacher = false;

let list = [
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 4 },
    { index: 5 },
    { index: 6 },
    { index: 7 },
    { index: 8 },
    { index: 9 },
    { index: 10 },
    { index: 11 },
    { index: 12 },
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