// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var stickx = 70;
var stickPos = [
	{ x : 0, y : 0, angle : 0 },
	{ x : 0, y : -stickx * 2, angle : 0 },
	{ x : stickx, y : stickx, angle : 90 },
	{ x : stickx, y : -stickx, angle : 90 },
	{ x : stickx, y : -stickx * 3, angle : 90 },
	{ x : stickx * 2, y : 0, angle : 0 },
	{ x : stickx * 2, y : -stickx * 2, angle : 0 },
];
var numStick = [
	{ num : 0, stickPos : [ 0, 1, 2, 4, 5, 6 ], lost : [ 3 ] },
	{ num : 1, stickPos : [ 5, 6 ], lost : [ 0, 1, 2, 3, 4 ] },
	{ num : 2, stickPos : [ 1, 2, 3 ,4 ,5 ], lost : [ 0, 6 ] },
	{ num : 3, stickPos : [ 2, 3, 4, 5, 6 ], lost : [ 0, 1 ] },
	{ num : 4, stickPos : [ 0, 3, 5, 6 ], lost : [ 1, 2, 4 ] },
	{ num : 5, stickPos : [ 0, 2, 3, 4, 6 ], lost : [ 1, 5 ] },
	{ num : 6, stickPos : [ 0, 1, 2, 3, 4, 6 ], lost : [ 5 ] },
	{ num : 7, stickPos : [ 2, 5, 6 ], lost : [ 0, 1, 3, 4 ] },
	{ num : 8, stickPos : [ 0, 1, 2, 3, 4, 5, 6 ], lost : [], remove : { "1" : true, "3" : true, "5" : true } },
	{ num : 9, stickPos : [ 0, 2, 3, 4, 5, 6 ], lost : [ 1 ] },
];

for( var i = 0; i < numStick.length; i++ ){
	numStick[i].haveStick = {};
	var tmp = numStick[i];
	for( var j = 0; j < tmp.stickPos.length; j++){
		numStick[i].haveStick["" + tmp.stickPos[j]] = true;
	}
	numStick[i].guid = numStick[i].stickPos.join();
}

module.exports = {
	createFun: {
		tri: function(stickred, stickgreen){
			var stick1 = cc.instantiate(stickred);
			stick1.sindex = 1;
			stick1.angle = 330;
			stick1.x = -300
			stick1.y = -60;

			var stick2 = cc.instantiate(stickred);
			stick2.sindex = 2;
			stick2.angle = 210;
			stick2.x = -170;
			stick2.y = -60;

			var stick3 = cc.instantiate(stickred);
			stick3.sindex = 3;
			stick3.angle = 90;
			stick3.x = -240;
			stick3.y = -180;

			var stick4 = cc.instantiate(stickgreen);
			stick4.sindex = 4;
			stick4.canClick = true;
			stick4.x = 50;
			stick4.y = -60;

			var stick5 = cc.instantiate(stickgreen);
			stick5.sindex = 5;
			stick5.canClick = true;
			stick5.x = 150;
			stick5.y = -60;

			var sticks = [];
			sticks.push(stick1);
			sticks.push(stick2);
			sticks.push(stick3);
			sticks.push(stick4);
			sticks.push(stick5);

			return sticks;
		},
		removestick: function(stickred, stickgreen, question){
			var orgx = -400 + ( question.group - 1 ) * 200;
			var ns = numStick[question.exts.orgNum];
			var sticks = [];
			for( var i = 0; i < ns.stickPos.length; i++ ){
				var pos = stickPos[ns.stickPos[i]];
				var stick = cc.instantiate(stickred);
				stick.sindex = ns.stickPos[i];
				stick.sgroup = question.group;
				stick.x = orgx + pos.x;
				stick.y = pos.y;
				stick.angle = pos.angle;
				stick.scale = 0.5;
				stick.canClick = true;
				sticks.push(stick);
			}

			return sticks;
		},
		movestick: function(stickred, stickgreen, question){

		},
	},
	checkFun: {
		tri: function(question, stick){
			var delta = 20;

			if(question.stick1index == 0 || question.stick1index == stick.sindex){
				question.stick1index = stick.sindex;
				question.stick1angle = stick.angle;
			}
			else{
				question.stick2index = stick.sindex;
				question.stick2angle = stick.angle;
			}

			if(question.stick1angle % 180 == question.stick2angle % 180){
				question.ret = false;
				return;
			}

			var stickright = false;
			if(( stick.angle % 180 == 90 && Math.abs(stick.x + 90) <= delta && Math.abs(stick.y - 50) <= delta )
				|| (stick.angle % 180 == 150 && Math.abs(stick.x + 35) <= delta && Math.abs(stick.y + 55) <= delta )){
				stickright = true;
			}
			if( stick.sindex == question.stick1index ){
				question.stick1right = stickright;
			}
			else{
				question.stick2right = stickright;
			}

			question.ret = question.stick1right && question.stick2right;
		},
		removestick: function(question, stick){
        	question.groupRemove[stick.sgroup - 1] = stick.sindex;
        	var ret = true;
        	for(var i = 0; i < question.groupRemove.length; i++){
        		var sindex = question.groupRemove[i];
        		ret = ret && (!!numStick[question.exts.orgNum].remove["" + sindex]);
        	}
        	question.ret = ret;
		},
		movestick: function(question, stick, sticks){
			var delta = 20;
			var orgx = -400 + ( stick.sgroup - 1 ) * 200;
			var nowx = stick.x;
			var nowy = stick.y;
			var settleIndex = -1;
			for(var i = 0; i < stickPos.length; i++){
				var pos = stickPos[i];
				// cc.log("nowx: " + nowx + ", nowy: " + nowy + ", pos.x: " + pos.x + ", pos.y: " + pos.y);
				if(Math.abs(nowx - orgx - pos.x) <= delta && Math.abs(nowy - pos.y) <= delta){
					stick.x = orgx + pos.x;
					stick.y = pos.y;
					stick.angle = pos.angle;
					stick.orgIndex = stick.sindex;
					stick.sindex = i;
					settleIndex = i;
				}
			}
			if(settleIndex == -1){
				stick.x = stick.orgx;
				stick.y = stick.orgy;
			}
			else{
				var idxs = [];
				var moveNum = 0;
				var ns = numStick[question.exts.orgNum];
				for(var i = 0; i < sticks.length; i++){
					if(sticks[i].group == stick.group){
						idxs.push(sticks[i].sindex);
						if(!ns.haveStick["" + sticks[i].sindex]){
							moveNum++;
							if(moveNum > 1){
								question.groupRemove[stick.sgroup] = -1;
								question.ret = false;
								return;
							}
						}
					}
				}
				idxs.sort();
				var newGuid = idxs.join();
				for(var i = 0; i < numStick.length; i++){
					if(i != stick.sgroup){
						if(numStick[i].guid == newGuid){
							question.groupRemove[stick.sgroup - 1] = i;
						}
					}
				}
				var ret = true;
				for(var i = 0; i < question.groupRemove.length; i++){
					ret = ret && (question.groupRemove[i] != -1);
				}
				question.ret = ret;
			}
		}
	},
}