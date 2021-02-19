let hardCfg = [
    {speed : 1000, g : -1000, interval : 2},
    {speed : 1200, g : -1500, interval : 1.5},
    {speed : 1500, g : -1800, interval : 1.5},
];

let finalScore = 0;

let lvByScore = [
    {level : 0, score : 0},
    {level : 1, score : 10},
    {level : 2, score : 20}
];

let lifeCount = 3;

module.exports = {
    hardCfg,
    lvByScore,
    lifeCount,
    finalScore
}