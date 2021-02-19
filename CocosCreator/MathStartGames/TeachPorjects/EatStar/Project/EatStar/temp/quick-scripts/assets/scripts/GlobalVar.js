(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/GlobalVar.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '47100PaXvhDD4L9UYHdhKrp', 'GlobalVar', __filename);
// scripts/GlobalVar.js

"use strict";

var lifeCount = 5; // 生命值
var playerSizeList = { // 难度配置
    0: { scale: 0.6, jumpHeight: 180, xSpeed: 180 },
    5: { scale: 0.8, jumpHeight: 250, xSpeed: 230 },
    10: { scale: 1, jumpHeight: 300, xSpeed: 280 }
};
var finalScore = 0;

module.exports = {
    lifeCount: lifeCount,
    playerSizeList: playerSizeList,
    finalScore: finalScore
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GlobalVar.js.map
        