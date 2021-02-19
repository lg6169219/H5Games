/**
 * 规定
 * 服务号 命令号 不能为0
 * 服务号 命令号 大小不能超过2个字节的整数
 * buf协议里面2个字节来存放服务号 2个字节来存放命令号，服务号 0 1两个字节，命令号 2 3两个字节
 * 加密、解密
 * 服务号 命令号二进制中都用小尾存储，UInt 无符号
 * 所有的文本，都用utf-8
 */

var log = require("../utils/log.js");
var netbus = require("./netbus.js");
var proto_man = {
    PROTO_JSON: 1,
    PROTO_BUF: 2,
    encode_cmd: encode_cmd,
    decode_cmd: decode_cmd,
    reg_buf_decoder: reg_buf_decoder,
    reg_buf_encoder: reg_buf_encoder,
    str_proto: {
        1: "PROTO_JSON",
        2: "PROTO_BUF",
    }
};

// 加密
function encrypt_cmd(str_or_buf) {
    return str_or_buf;
}
// 解密
function decrypt_cmd(str_or_buf) {
    return str_or_buf;
}

// json编码
function _json_encode(stype, ctype, body) {
    var cmd = {};
    cmd[0] = stype;
    cmd[1] = ctype;
    cmd[2] = body;
    return JSON.stringify(cmd);
}

function _json_decode(cmd_json) {
    var cmd = null;
    try {
        cmd = JSON.parse(cmd_json);
    } catch (e) {

    }
    if (!cmd ||
        typeof(cmd[0]) == "undefined" ||
        typeof(cmd[1]) == "undefined" ||
        typeof(cmd[2]) == "undefined"
    ) {
        return null;
    }
    return cmd;
}

// key, value, stype + ctype --> key:value
function get_key(stype, ctype) {
    return (stype * 65536 + ctype);
}

/**
 * 
 * @param {协议类型 json buf协议} proto_type 
 * @param {服务类型} stype 
 * @param {命令号} ctype 
 * @param {发送的数据 js对象或者js文本} body
 * @returns {编码后的数据}
 */
function encode_cmd(proto_type, stype, ctype, body) {
    var buf = null;
    if (proto_type == proto_man.PROTO_JSON) {
        buf = _json_encode(stype, ctype, body);
    } else {
        // buf协议
        var key = get_key(stype, ctype);
        console.log("========111", key, encoders, !encoders[key]);
        if (!encoders[key]) {
            return null;
        }
        buf = encoders[key](body);
    }

    if (buf) {
        buf = encrypt_cmd(buf); // 加密
    }
    return buf;
}

/**
 * 
 * @param {协议类型} proto_type 
 * @param {接收到的数据} str_or_buf 
 * @returns {0:stype, 1:ctype, 2:body}
 */
function decode_cmd(proto_type, str_or_buf) {
    str_or_buf = decrypt_cmd(str_or_buf); // 先解密

    if (proto_type == proto_man.PROTO_JSON) {
        return _json_decode(str_or_buf);
    }

    if (str_or_buf.length < 4) {
        return null;
    }

    var cmd = null;
    var stype = str_or_buf.readUInt16LE(0);
    var ctype = str_or_buf.readUInt16LE(2);
    var key = get_key(stype, ctype);
    if (!decoders[key]) {
        return null;
    }

    cmd = decoders[key](str_or_buf);
    return cmd;
}

// buf协议的编码/解码管理  stype, ctype --> encoder/decoder
var decoders = {}; // 保存当前我们buf协议所有的解码函数，stype,ctype -->
var encoders = {}; // 保存当前我们buf协议所有的编码函数，stype，ctype -->

function reg_buf_encoder(stype, ctype, encode_func) {
    var key = get_key(stype, ctype);
    if (encoders[key]) {
        log.warn("stype: " + stype + "ctype: " + ctype + "is reged!!");
    }
    encoders[key] = encode_func;
    console.log(encoders);
}

// decode_func(cmd_buf) return cmd{0 服务号 1命令号 2 body}
function reg_buf_decoder(stype, ctype, decode_func) {
    var key = get_key(stype, ctype);
    if (decoders[key]) {
        log.warn("stype: " + stype + "ctype: " + ctype + "is reged!!");
    }
    decoders[key] = decode_func;
    console.log(decoders);

}

module.exports = proto_man;