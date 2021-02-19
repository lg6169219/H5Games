const Fs = require('fire-fs');

var item_size = 32;
// var gen_tools = {

// 	find_map: function(root) {
// 		if (root.active === false) {
// 			return null;
// 		}

// 		if(root.group === "NAV_MAP") {
// 			return root;
// 		}

// 		for(var i = 0; i < root.children.length; i ++) {
// 			var node = this.find_map(root.children[i]);
// 			if (node) {
// 				return node;
// 			}
// 		}

// 		return null;
// 	},

// 	gen_one_obstacle: function(map_root, item, map) {
// 		if (item.width <= 0 || item.height <= 0) {
// 			return;
// 		}

// 		var w_pos = item.convertToWorldSpaceAR(cc.p(0, 0));
// 		var m_pos = map_root.convertToNodeSpaceAR(w_pos);

// 		var left = m_pos.x - item.width * 0.5;
// 		var right = m_pos.x + item.width * 0.5;
// 		var top = m_pos.y + item.height * 0.5;
// 		var bottom = m_pos.y - item.height * 0.5;

// 		var left_index = Math.floor(left / item_size);
// 		var bottom_index = Math.floor(bottom / item_size);
// 		var right_index = Math.floor((right + item_size - 1) / item_size);
// 		var top_index = Math.floor((top + item_size - 1) / item_size);

// 		for(var i = bottom_index; i < top_index; i ++) {
// 			for(var j = left_index; j < right_index; j ++) {
// 				map.data[i * map.width + j] = 1;
// 			}
// 		}
// 	},

// 	gen_obstacle_data: function(map_root, root, map) {
// 		if(root.group !== "MAP_OBSTACLE") {
// 			return;
// 		}

// 		this.gen_one_obstacle(map_root, root, map);

// 		for(var i = 0; i < root.children.length; i ++) {
// 			this.gen_obstacle_data(map_root, root.children[i], map);
// 		}
// 	},

// 	gen_map_data: function(map_root) {
// 		var map_width = Math.floor((map_root.width + item_size - 1) / item_size);
// 		var map_height = Math.floor((map_root.height + item_size - 1) / item_size);

// 		var map_data = [];
// 		for(var i = 0; i < map_height; i ++) {
// 			for(var j = 0; j < map_width; j ++) {
// 				map_data.push(0);
// 			}
// 		}

// 		var map = {};
// 		map.name = map_root.name;
// 		map.data = map_data;
// 		map.width = map_width;
// 		map.height = map_height;
// 		map.item_size = item_size;

// 		for(var i = 0; i < map_root.children.length; i ++) {
// 			this.gen_obstacle_data(map_root, map_root.children[i], map);
// 		}
// 		return map;
// 	},

//     'gen_nevmesh': function (event) {
//         /*;
//         Editor.log('children length : ' + canvas.children.length);
//         var pos = canvas.convertToWorldSpaceAR(cc.p(0, 0));
//         Editor.log(pos);
// 		*/
// 		var canvas = cc.find('Canvas')

//         var map = gen_tools.find_map(canvas);

//         var game_map = null;
//         if(map) {
//         	game_map = gen_tools.gen_map_data(map);
//         }

//         if (event.reply) {
//             event.reply("OK", game_map);
//         }
//     },
// };

// module.exports = gen_tools;




var gen_tools = {
    'gen_nevmesh': function(event) {
        var level_map = null;
        for (let i = 1; i <= 100; i++) {
            level_map = cc.find("level" + i + "_map");
            if (level_map) {
                break;
            }
        }

        if (!level_map) {
            Editor.log("Error Map");
        }

        var anim_com = level_map.getComponent(cc.Animation);
        var clips = anim_com.getClips();
        var clip = clips[0];

        var paths = clip.curveData.paths;

        this.road_data_set = [];

        var k;
        for (k in paths) {
            var road_data = paths[k].props.position;
            this.gen_path_data(road_data);
        }


        var map = {};
        map.name = level_map.name;
        map.data = this.road_data_set;

        if (event.reply) {
            event.reply("OK", map);
        }
    },
    gen_path_data: function(road_data) {
        var ctrl1 = null;
        var start_point = null;
        var end_point = null;
        var ctrl2 = null;

        var road_curve_path = []; // [start_point, ctrl1, ctrl2, end_point],
        for (var i = 0; i < road_data.length; i++) {
            var key_frame = road_data[i];
            if (ctrl1 !== null) {
                road_curve_path.push([start_point, ctrl1, ctrl1, cc.v2(key_frame.value[0], key_frame.value[1])]);
            }

            start_point = cc.v2(key_frame.value[0], key_frame.value[1]);

            for (var j = 0; j < key_frame.motionPath.length; j++) {
                var end_point = cc.v2(key_frame.motionPath[j][0], key_frame.motionPath[j][1]);
                ctrl2 = cc.v2(key_frame.motionPath[j][2], key_frame.motionPath[j][3]);
                if (ctrl1 === null) {
                    ctrl1 = ctrl2;
                }
                // 贝塞尔曲线 start_point, ctrl1, ctrl2, end_point,
                road_curve_path.push([start_point, ctrl1, ctrl2, end_point]);
                ctrl1 = cc.v2(key_frame.motionPath[j][4], key_frame.motionPath[j][5]);
                start_point = end_point;
            }
        }

        var one_road = [road_curve_path[0][0]];

        for (var index = 0; index < road_curve_path.length; index++) {
            start_point = road_curve_path[index][0];
            ctrl1 = road_curve_path[index][1];
            ctrl2 = road_curve_path[index][2];
            end_point = road_curve_path[index][3];

            var len = this.bezier_length(start_point, ctrl1, ctrl2, end_point);
            var OFFSET = 16;
            var count = len / OFFSET;
            count = Math.floor(count);
            var t_delta = 1 / count;
            var t = t_delta;

            for (var i = 0; i < count; i++) {
                var x = start_point.x * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.x * t * (1 - t) * (1 - t) + 3 * ctrl2.x * t * t * (1 - t) + end_point.x * t * t * t;
                var y = start_point.y * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.y * t * (1 - t) * (1 - t) + 3 * ctrl2.y * t * t * (1 - t) + end_point.y * t * t * t;
                one_road.push(cc.v2(x, y));
                t += t_delta;
            }
        }

        this.road_data_set.push(one_road);
    },

    bezier_length: function(start_point, ctrl1, ctrl2, end_point) {
        // t [0, 1] t 分成20等分 1 / 20 = 0.05
        var prev_point = start_point;
        var length = 0;
        var t = 0.05;
        for (var i = 0; i < 20; i++) {
            var x = start_point.x * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.x * t * (1 - t) * (1 - t) + 3 * ctrl2.x * t * t * (1 - t) + end_point.x * t * t * t;
            var y = start_point.y * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.y * t * (1 - t) * (1 - t) + 3 * ctrl2.y * t * t * (1 - t) + end_point.y * t * t * t;
            var now_point = cc.v2(x, y);
            // var dir = cc.pSub(now_point, prev_point);
            var dir = now_point.sub(prev_point);
            prev_point = now_point;
            length += dir.mag();

            t += 0.05;
        }
        return length;
    }
};
module.exports = gen_tools;

// onLoad: function() {
// 	this.anim_com = this.node.getComponent(cc.Animation);
// 	var clips = this.anim_com.getClips();
// 	var clip = clips[0];

// 	this.graphics = this.node.addComponent(cc.Graphics);
// 	this.graphics.fillColor = cc.color(255, 0, 0, 255);
// 	var paths = clip.curveData.paths;
// 	// console.log(paths);

// 	this.road_data_set = [];

// 	var k;
// 	for (k in paths) {
// 		var road_data = paths[k].props.position;
// 		this.gen_path_data(road_data);
// 	}


// },


// get_road_set: function() {
// 	return this.road_data_set;
// },

// gen_path_data: function(road_data) {
// 	var ctrl1 = null;
// 	var start_point = null;
// 	var end_point = null;
// 	var ctrl2 = null;

// 	var road_curve_path = []; // [start_point, ctrl1, ctrl2, end_point],
// 	for (var i = 0; i < road_data.length; i++) {
// 		var key_frame = road_data[i];
// 		if (ctrl1 !== null) {
// 			road_curve_path.push([start_point, ctrl1, ctrl1, cc.v2(key_frame.value[0], key_frame.value[1])]);
// 		}

// 		start_point = cc.v2(key_frame.value[0], key_frame.value[1]);

// 		for (var j = 0; j < key_frame.motionPath.length; j++) {
// 			var end_point = cc.v2(key_frame.motionPath[j][0], key_frame.motionPath[j][1]);
// 			ctrl2 = cc.v2(key_frame.motionPath[j][2], key_frame.motionPath[j][3]);
// 			if (ctrl1 === null) {
// 				ctrl1 = ctrl2;
// 			}
// 			// 贝塞尔曲线 start_point, ctrl1, ctrl2, end_point,
// 			road_curve_path.push([start_point, ctrl1, ctrl2, end_point]);
// 			ctrl1 = cc.v2(key_frame.motionPath[j][4], key_frame.motionPath[j][5]);
// 			start_point = end_point;
// 		}
// 	}

// 	var one_road = [road_curve_path[0][0]];

// 	for (var index = 0; index < road_curve_path.length; index++) {
// 		start_point = road_curve_path[index][0];
// 		ctrl1 = road_curve_path[index][1];
// 		ctrl2 = road_curve_path[index][2];
// 		end_point = road_curve_path[index][3];

// 		var len = this.bezier_length(start_point, ctrl1, ctrl2, end_point);
// 		var OFFSET = 16;
// 		var count = len / OFFSET;
// 		count = Math.floor(count);
// 		var t_delta = 1 / count;
// 		var t = t_delta;

// 		for (var i = 0; i < count; i++) {
// 			var x = start_point.x * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.x * t * (1 - t) * (1 - t) + 3 * ctrl2.x * t * t * (1 - t) + end_point.x * t * t * t;
// 			var y = start_point.y * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.y * t * (1 - t) * (1 - t) + 3 * ctrl2.y * t * t * (1 - t) + end_point.y * t * t * t;
// 			one_road.push(cc.v2(x, y));
// 			t += t_delta;
// 		}
// 	}

// 	this.road_data_set.push(one_road);
// },


// bezier_length: function(start_point, ctrl1, ctrl2, end_point) {
// 		// t [0, 1] t 分成20等分 1 / 20 = 0.05
// 		var prev_point = start_point;
// 		var length = 0;
// 		var t = 0.05;
// 		for (var i = 0; i < 20; i++) {
// 			var x = start_point.x * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.x * t * (1 - t) * (1 - t) + 3 * ctrl2.x * t * t * (1 - t) + end_point.x * t * t * t;
// 			var y = start_point.y * (1 - t) * (1 - t) * (1 - t) + 3 * ctrl1.y * t * (1 - t) * (1 - t) + 3 * ctrl2.y * t * t * (1 - t) + end_point.y * t * t * t;
// 			var now_point = cc.v2(x, y);
// 			// var dir = cc.pSub(now_point, prev_point);
// 			var dir = now_point.sub(prev_point);
// 			prev_point = now_point;
// 			length += dir.mag();

// 			t += 0.05;
// 		}
// 		return length;
// 	}
// 	// called every frame, uncomment this function to activate update callback
// 	// update: function (dt) {