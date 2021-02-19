var logger = require('pomelo-logger').getLogger('bearcat-treasures', 'PlayerHandler');
var bearcat = require('bearcat');
var fs = require('fs');


var PlayerHandler = function (app) {
  this.app = app;
  this.consts = null;
  this.areaService = null;
};

/**
 *玩家申请进入游戏
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @api public
 */
PlayerHandler.prototype.enterScene = function (msg, session, next) {
  var role = this.dataApiUtil.role().random();
  var player = bearcat.getBean('player', {
    id: msg.playerId,
    name: msg.name,
    kindId: role.id
  });

  player.serverId = session.frontendId;

  player.buyerList = {};
  player.buyerList[101] = {id : 101, level : 1};
  player.buyerList[102] = {id : 102, level : 1};
  player.buyerList[103] = {id : 103, level : 1};


  if (!this.areaService.addEntity(player)) {
    logger.error("Add player to area faild! areaId : " + player.areaId);
    next(new Error('fail to add user into area'), {
      route: msg.route,
      code: this.consts.MESSAGE.ERR
    });
    return;
  }

  var r = {
    code: this.consts.MESSAGE.RES,
    data: {
      area: this.areaService.getAreaInfo(),
      playerId: player.id,
      buyerList : player.buyerList
    }
  };

  next(null, r);
};

/**
 * Get player's animation data.
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @api public
 */
var animationData = null;
PlayerHandler.prototype.getAnimation = function (msg, session, next) {
  var path = '../../../../config/animation_json/';
  if (!animationData) {
    var dir = './config/animation_json';
    var name, reg = /\.json$/;
    animationData = {};
    fs.readdirSync(dir).forEach(function (file) {
      if (reg.test(file)) {
        name = file.replace(reg, '');
        animationData[name] = require(path + file);
      }
    });
  }
  next(null, {
    code: this.consts.MESSAGE.RES,
    data: animationData
  });
};


/**
 * 状态更换(同步跑步 原近战攻击)
 */
PlayerHandler.prototype.changeStage = function (msg, session, next) {

  var playerId = session.get('playerId');
  var player = this.areaService.getPlayer(playerId);
  if (!player) {
    logger.error('Move without a valid player ! playerId : %j', playerId);
    next(new Error('invalid player:' + playerId), {
      code: this.consts.MESSAGE.ERR
    });
    return;
  }
  //通知区域内其他玩家
  this.areaService.getChannel().pushMessage({
    route: 'onChangeStage',
    entityId: player.entityId,
    s: msg.S
  });
}

/**
 * 玩家抽奖
 */

// 返回一个随机的道具
var getLotteryArr = function(randNum, beginArr, maxRate){
  if (!beginArr || beginArr.length <= 0){
    return;
  }
  var currArr = beginArr;
  var lastArr = [];
  for (var i = 0;  i < randNum; i++){
    var rnum = Math.ceil(Math.random() * maxRate);
    var count = 1;

    for (var m = 0; m < currArr.length; m++){
      var v = currArr[m];
      if (rnum >= count && rnum < count + v.rate){
        lastArr.push(v);
        break;
      }
      count = count + v.rate;
    }
  }
  return lastArr;
}

// 洗牌
function randomSort(arr) {
  var newArr = [];
  for(var i = 0, len = arr.length; i < len; i++) {
    var j = Math.floor(Math.random() * (len - i));
    newArr[i] = arr[j];
    arr.splice(j, 1)
  }
  return newArr;
}


PlayerHandler.prototype.doLottery = function (msg, session, next) {
  var playerId = session.get('playerId');
  var player = this.areaService.getPlayer(playerId);
  if (!player) {
    logger.error('Move without a valid player ! playerId : %j', playerId);
    next(new Error('invalid player:' + playerId), {
      code: this.consts.MESSAGE.ERR
    });
    return;
  }
  var orderID = 1;//msg.orderID;
  var testjson = this.dataApiUtil.test()[orderID];
  // 0.校验

  // 1.获取客户端要抽奖的订单号
  // 2.根据订单号找到对应配置表cfg
  var cfgData = {};
  // 3.根据配置表  处理 获取最大概率 以及符合需求的数组
  var testArr = [];
  testArr.push(1);
  console.log("=========haha", testArr, testArr[0]);

  var finalArr = []; // 最终生成的数组
  // 4.开始判断是否随机出特殊货物
  var rateSum = testjson.specialRateSum;
  var startArr = testjson.specialArr;
  var list = getLotteryArr(1, startArr, rateSum);
  for (var a in list){
    finalArr.push(list[a]);
  }

  // 5.开始判断是否随机出高级货物
  var rateSum = testjson.superRateSum;
  var startArr2 = testjson.superArr;
  var list = getLotteryArr(1, startArr2, rateSum);
  for (var a in list){
    finalArr.push(list[a]);
  }

  var normalArr = testjson.normalArr;
  // 6.直接取中级低级不随机
  for (var i = 0; i < 10; i++){
    if (normalArr[i]){
      finalArr.push(normalArr[i]);
    }
  }
  // 根据times重新生成数组 洗牌
  var needSortList = [];
  for (var i in finalArr){
    var data = finalArr[i];
    var newData = [];
    newData.goodid = data.goodid;
    newData.num = data.num;

    if (data.times && data.times > 1){
        for (var m = 1;  m <= data.times; m++){
            needSortList.push(newData);
        }
    }
    else
    {
        needSortList.push(newData);
    }
  }
  console.log("=========aaa", needSortList);
  var sortDoneArr = randomSort(needSortList);
  console.log("=========bbb", sortDoneArr);

  next(null, {
    code: this.consts.MESSAGE.RES,
    data : finalArr
  });
}

/**
 * Player moves. Player requests move with the given movePath.
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @api public
 */
PlayerHandler.prototype.move = function (msg, session, next) {
  var endPos = msg.targetPos;
  var playerId = session.get('playerId');
  var player = this.areaService.getPlayer(playerId);
  if (!player) {
    logger.error('Move without a valid player ! playerId : %j', playerId);
    next(new Error('invalid player:' + playerId), {
      code: this.consts.MESSAGE.ERR
    });
    return;
  }

  var target = this.areaService.getEntity(msg.target);
  player.target = target ? target.entityId : null;

  if (endPos.x > this.areaService.getWidth() || endPos.y > this.areaService.getHeight()) {
    logger.warn('The path is illigle!! The path is: %j', msg.path);
    next(new Error('fail to move for illegal path'), {
      code: this.consts.MESSAGE.ERR
    });

    return;
  }

  var action = bearcat.getBean('move', {
    entity: player,
    endPos: endPos,
  });

  if (this.areaService.addAction(action)) {
    next(null, {
      code: this.consts.MESSAGE.RES,
      sPos: player.getPos()
    });

    this.areaService.getChannel().pushMessage({
      route: 'onMove',
      entityId: player.entityId,
      endPos: endPos
    });
  }
};

module.exports = function (app) {
  return bearcat.getBean({
    id: "playerHandler",
    func: PlayerHandler,
    args: [{
      name: "app",
      value: app
    }],
    props: [{
      name: "areaService",
      ref: "areaService"
    }, {
      name: "dataApiUtil",
      ref: "dataApiUtil"
    }, {
      name: "consts",
      ref: "consts"
    }]
  });
};