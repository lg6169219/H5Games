"use strict";
cc._RF.push(module, '47100PaXvhDD4L9UYHdhKrp', 'GlobalVar');
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