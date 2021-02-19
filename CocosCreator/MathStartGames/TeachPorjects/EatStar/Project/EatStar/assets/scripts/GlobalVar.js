let lifeCount = 5; // 生命值
let playerSizeList = { // 难度配置
    0 : {scale : 0.6, jumpHeight : 180, xSpeed : 180},
    5 : {scale : 0.8, jumpHeight : 250, xSpeed : 230},
    10 : {scale : 1, jumpHeight : 300, xSpeed : 280},
};
let finalScore = 0;

module.exports = {
    lifeCount,
    playerSizeList,
    finalScore
}