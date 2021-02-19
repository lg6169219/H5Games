// 关卡数据
var enemy = require("enemy");

var map_level3_data = [{
        des: "3个哥布林",
        create_delay: 0,
        type: [enemy.Small1], // 怪物类型 
        num: [3], // 当前波创建几个怪物

        create_time_set: [
            [0, 0.5, 0.5],
        ],

        random_road: true, // 随机选择怪物放置路径
        road_set: [0, 1, 2], // 0 1 2 规定的路径

        actor_params: {
            speed: 50, // 速度
            health: 30, // 血
            attack: 10, // 攻击力
            player_hurt: 1,
            dead_chip: 50, // 怪物死亡金币奖励
        }
    },
    {
        des: "6个哥布林",
        create_delay: 5,
        type: [enemy.Small1], // 怪物类型 
        num: [6], // 当前波创建几个怪物

        create_time_set: [
            [0, 0.6, 0.6, 3.6, 0.6, 0.6],
        ],

        random_road: false, // 随机选择怪物放置路径
        road_set: [0, 1, 2, 0, 1, 2, 0, 1], // 0 1 2 规定的路径

        actor_params: {
            speed: 50, // 速度
            health: 30, // 血
            attack: 10, // 攻击力
            player_hurt: 1,
            dead_chip: 50, // 怪物死亡金币奖励
        }
    },
    {
        des: "9个哥布林",
        create_delay: 5,
        type: [enemy.Small1], // 怪物类型 
        num: [9], // 当前波创建几个怪物

        create_time_set: [
            [0, 0.5, 0.5, 3, 0.5, 0.5, 3, 0.5, 0.5],
        ],
        random_road: true, // 随机选择怪物放置路径
        road_set: [0, 1, 2], // 0 1 2 规定的路径

        actor_params: {
            speed: 50, // 速度
            health: 30, // 血
            attack: 10, // 攻击力
            player_hurt: 1,
            dead_chip: 50, // 怪物死亡金币奖励
        }
    },
    {
        des: "4个哥布林, 1个兽人",
        create_delay: 5,
        type: [enemy.Small1, enemy.Bear], // 怪物类型 
        num: [4, 1], // 当前波创建几个怪物

        create_time_set: [
            [0, 0.5, 0.5, 0.5],
            [3.5],
        ],
        random_road: true, // 随机选择怪物放置路径
        road_set: [0, 1, 2], // 0 1 2 规定的路径

        actor_params: {
            speed: 50, // 速度
            health: 80, // 血
            attack: 20, // 攻击力
            player_hurt: 1,
            dead_chip: 50, // 怪物死亡金币奖励
        }
    },
    {
        des: "3个兽人",
        create_delay: 5,
        type: [enemy.Bear], // 怪物类型 
        num: [3], // 当前波创建几个怪物

        create_time_set: [
            [0.5, 0.8, 0.75],
        ],
        random_road: true, // 随机选择怪物放置路径
        road_set: [0, 1, 2], // 0 1 2 规定的路径

        actor_params: {
            speed: 40, // 速度
            health: 120, // 血
            attack: 30, // 攻击力
            player_hurt: 1,
            dead_chip: 50, // 怪物死亡金币奖励
        }
    },
    {
        des: "10个哥布林，4个兽人",
        create_delay: 5,
        type: [enemy.Small1, enemy.Bear, enemy.Small1, enemy.Bear], // 怪物类型 
        num: [5, 2, 5, 2], // 当前波创建几个怪物

        create_time_set: [
            [0, 0.5, 0.5, 0.5, 0.5],
            [3, 0.5],
            [3, 0.5, 0.5, 0.5, 0.5],
            [3, 0.5],
        ],
        random_road: true, // 随机选择怪物放置路径
        road_set: [0, 1, 2], // 0 1 2 规定的路径

        actor_params: {
            speed: 50, // 速度
            health: 150, // 血
            attack: 30, // 攻击力
            player_hurt: 1,
            dead_chip: 50, // 怪物死亡金币奖励
        }
    },
    {
        des: "16个哥布林",
        create_delay: 5,
        type: [enemy.Small1], // 怪物类型 
        num: [16], // 当前波创建几个怪物

        create_time_set: [
            [
                0, 0.5, 0.5, 0.5,
                2, 0.5, 0.5, 0.5,
                2, 0.5, 0.5, 0.5,
                2, 0.5, 0.5, 0.5
            ],
        ],
        random_road: false, // 随机选择怪物放置路径
        road_set: [1], // 0 1 2 规定的路径

        actor_params: {
            speed: 80, // 速度
            health: 150, // 血
            attack: 30, // 攻击力
            player_hurt: 1,
            dead_chip: 50, // 怪物死亡金币奖励
        }
    },
];

module.exports = map_level3_data;