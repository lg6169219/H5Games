var proto_man = require("../netbus/proto_man.js");

// 二进制的编码、解码
function encode_cmd_1_1(body) {
    var stype = 1;
    var ctype = 1;

    var total_len = 2 + 2 + body.uname.length + body.upwd.length + 2 + 2; // 每写一个字符串 就需要一个长度信息 2个字符 2 + 2
    var buf = Buffer.allocUnsafe(total_len);

    buf.writeUInt16LE(stype, 0); // 0 1
    buf.writeUInt16LE(ctype, 2); // 2 3

    // uname字符串
    buf.writeUInt16LE(body.uname.length, 4); // 先写长度 4 5
    buf.write(body.uname, 6);

    // upwd字符串
    var offset = 6 + body.uname.length;
    buf.writeUInt16LE(body.upwd.length, offset);
    buf.write(body.upwd, offset + 2);

    return buf;
}

function decode_cmd_1_1(cmd_buf) {
    var stype = 1;
    var ctype = 1;

    // uname
    var uname_len = cmd_buf.readUInt16LE(4);
    if ((uname_len + 2 + 2 + 2) > cmd_buf.length) { // 2 + 2 服务号 命令号  2 长度
        return null;
    }

    var uname = cmd_buf.toString("utf8", 6, 6 + uname_len);
    if (!uname) {
        return null;
    }

    var offset = 6 + uname_len;
    var upwd_len = cmd_buf.readUInt16LE(offset);
    if ((offset + upwd_len + 2) > cmd_buf.length) {
        return null;
    }
    var upwd = cmd_buf.toString("utf8", offset + 2, offset + 2 + upwd_len);

    var cmd = {
        0: 1,
        1: 1,
        2: {
            "uname": uname,
            "upwd": upwd,
        }
    }
    return cmd;
}

proto_man.reg_buf_encoder(1, 1, encode_cmd_1_1);
proto_man.reg_buf_decoder(1, 1, decode_cmd_1_1);