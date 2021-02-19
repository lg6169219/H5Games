/**
 * 玩家数据
 * chip: 2000 玩家金币
 * blood: 20 玩家血量
 * level_info : [0, 0, 0, 0, 0 ... 0] 玩家闯关数据 1 2 3星
 * star_num: 12 玩家当前获取的星数
 * 游戏总星数 77
 * 
 * tower_skills_level : {
 *  arrow_level : 1,
 *  infantry_level : 1,
 *  warlock_level : 1,
 *  artillery_level : 1,
 *  skills_bomb_level : 1,
 *  skills_infantry_level : 1
 * }
 */

var ugame = {
    user_data: {
        0: null,
        1: null,
        2: null,
    },
    cur_user: 0,
    cur_playing_level: 0, // 当前正在玩的关卡
    is_game_started: false, // 游戏是否开始
    is_game_paused: false, // 游戏是否暂停

    enemy_set: [], // 敌人集合，方便遍历，新产生的敌人在后面，老的在前面，死亡或者到达后删除

    tower_skills_upgrade_config: {
        arrow_tower: [0, 1, 1, 2, 2, 3],
        infantry_tower: [0, 1, 2, 2, 3, 3],
        warlock_tower: [0, 1, 1, 2, 2, 3],
        artillery_tower: [0, 1, 2, 2, 2, 3],

        skills_bomb: [0, 1, 1, 2, 2, 3],
        skills_infantry: [0, 2, 3, 3, 3, 4],
    },
    // 同步数据 外部可调用
    sync_user_data: function() {
        var json_str = JSON.stringify(ugame.user_data);
        cc.sys.localStorage.setItem("user_data", json_str);
    },

    // 以哪个用户数据进入游戏
    set_cur_user: function(user_index) {
        if (user_index < 0 || user_index >= 3) {
            user_index = 0;
        }
        ugame.cur_user = user_index;
    },
    get_cur_user: function() {
        return ugame.user_data[ugame.cur_user];
    },
    set_cur_level: function(cur_level) {
        ugame.cur_playing_level = cur_level;
    },
    get_cur_level: function() {
        return ugame.cur_playing_level;
    },
    init_skill_level_info: function() {
        this.get_cur_user().skill_level_info = [0, 0, 0, 0, 0, 0];
    },
    // 设置road数据
    set_map_road_set: function(map_road_set) {
        ugame.map_road_set = map_road_set;
    },

    get_map_road_set: function() {
        return ugame.map_road_set;
    },

    // 清除enemy_set
    clear_enemy_set: function() {
        this.enemy_set = [];
    },
    add_enemy: function(e) {
        this.enemy_set.push(e);
    },
    remove_enemy: function(e) {
        var index = this.enemy_set.indexOf(e);
        this.enemy_set.splice(index, 1);
    },
    get_enemy_set: function() {
        return this.enemy_set;
    },
    search_enemy: function(center_pos, search_r) {
        for (var i = 0; i < this.enemy_set.length; i++) {
            var e_pos = this.enemy_set[i].getPosition();
            var len = e_pos.sub(center_pos).mag();
            if (len <= search_r) {
                return this.enemy_set[i];
            }
        }
        return null;
    },
    // 敌人还活着
    is_enemy_alive: function(e) {
        var index = this.enemy_set.indexOf(e);
        if (index < 0 || index >= this.enemy_set.length) {
            return false;
        }
        return true;
    },

    // 修改金钱
    add_chip: function(num) {
        var cur_user = ugame.get_cur_user();
        cur_user.chip += num;
    },
    get_chip: function() {
        var cur_user = ugame.get_cur_user();
        return cur_user.chip;
    },
};

// 计算玩家星星总数
function _compute_user_star() {
    for (var i = 0; i < 3; i++) {
        ugame.user_data[i].star_num = 0;
        for (let j = 0; j < ugame.user_data[i].level_info.length; j++) {
            ugame.user_data[i].star_num += ugame.user_data[i].level_info[j];
        }
    }
};

// 加载玩家数据(内部调用)
function _load_user_data() {
    var j_user_data = cc.sys.localStorage.getItem("user_data");
    if (j_user_data) {
        ugame.user_data = JSON.parse(j_user_data);
        return;
    }

    // 本地没有存储 初始化
    ugame.user_data = {
        0: {
            chip: 2000,
            blood: 20,
            level_info: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            star_num: 0,
            star_total: 77,
            skill_level_info: [0, 0, 0, 0, 0, 0], //[skill1, skill2, skill3, skill4, skill5, skill6]
        },
        1: {
            chip: 2000,
            blood: 20,
            level_info: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            star_num: 0,
            star_total: 77,
            skill_level_info: [0, 0, 0, 0, 0, 0], //[skill1, skill2, skill3, skill4, skill5, skill6]
        },
        2: {
            chip: 2000,
            blood: 20,
            level_info: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            star_num: 0,
            star_total: 77,
            skill_level_info: [0, 0, 0, 0, 0, 0], //[skill1, skill2, skill3, skill4, skill5, skill6]
        }
    };
    // 存到本地
    ugame.sync_user_data();
};
_load_user_data();
_compute_user_star();

module.exports = ugame;