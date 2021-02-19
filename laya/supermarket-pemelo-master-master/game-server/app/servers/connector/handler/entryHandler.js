var Code = require('../../../../../shared/code');
var bearcat = require('bearcat');
var userDao = require('../../../dao/userDao');
var buyersDao = require('../../../dao/buyersDao');

// generate playerId
var id = 1;

var EntryHandler = function(app) {
  this.app = app;
  this.serverId = app.get('serverId').split('-')[2];
};

/**
 * 服务端注册session信息 返回玩家playerId
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void} 返回玩家playerid
 */
EntryHandler.prototype.entry = function(msg, session, next) {
  var self = this;

  // 根据传入的名字 查找账号 有则返回ok 没有则返回另外消息 客户端发起创建账号
  userDao.getPlayerByName(msg.name, function(err, player) {
    if (player) {
      console.log("==player", player);
      var playerId = player.userId;
      var buyerList = [];
      userDao.getPlayerAllInfo(playerId, function(err, player) {
        if (err || !player) {
          logger.error('Get user for userDao failed! ' + err.stack);
          next(new Error('fail to get user from dao'), {
            route: msg.route,
            code: consts.MESSAGE.ERR
          });

          return;
        }
        buyerList = player.buyerList;
      });

      session.bind(playerId);
      session.set('playerId', playerId);
      session.set('areaId', 1);
      session.on('closed', onUserLeave.bind(null, self.app));
      session.pushAll();
      console.log("===getbuyerList", buyerList);
      next(null, {
        code: Code.OK,
        playerId: player.userId,
        buyerList: player.buyerList
      });
      return;
    }
    else{
      this.serverId = self.app.get('serverId').split('-')[2];
      var playerId = parseInt(this.serverId + id, 10);
      console.log("========playerId", this.serverId, id, playerId);
      id += 1;

      userDao.createPlayer(playerId, msg.name, function(err, player){
        if(err) {
          logger.error('[register] fail to invoke createPlayer for ' + err.stack);
          next(null, {code: consts.MESSAGE.ERR, error:err});
          return;
        }else{
          console.log("======unlockBuyers", playerId);
          buyersDao.unlockBuyers(playerId, function(err, results){
            afterLogin(self.app, msg, session, {id: playerId}, null, next);
          });
        }
      });
    }
  });

var afterLogin = function (app, msg, session, user, player, next) {
  session.bind(user.id);
  session.set('playerId', user.id);
  session.set('areaId', 1);
  session.on('closed', onUserLeave.bind(null, self.app));
  session.pushAll();

  next(null, {
    code: Code.OK,
    playerId: user.id
  });
};

  // var playerId = parseInt(this.serverId + id, 10);
  // id += 1;
  // session.bind(playerId);
  // session.set('playerId', playerId);
  // //session.set('playername', msg.name);
  // session.set('areaId', 1);
  // session.on('closed', onUserLeave.bind(null, self.app));
  // session.pushAll();
  // next(null, {
  //   code: Code.OK,
  //   playerId: playerId
  // });

  // new
  // var token = msg.token, self = this;

  // if(!token) {
  //   next(new Error('invalid entry request: empty token'), {code: Code.FAIL});
  //   return;
  // }

  // var uid, players, player;
  // async.waterfall([
  //   function(cb) {
  //     // auth token
  //     self.app.rpc.auth.authRemote.auth(session, token, cb);
  //   }, function(code, user, cb) {
  //     // query player info by user id
  //     if(code !== Code.OK) {
  //       next(null, {code: code});
  //       return;
  //     }

  //     if(!user) {
  //       next(null, {code: Code.ENTRY.FA_USER_NOT_EXIST});
  //       return;
  //     }

  //     uid = user.id;
  //     userDao.getPlayersByUid(user.id, cb);
  //   }, function(res, cb) {
  //     // generate session and register chat status
  //     players = res;
  //     self.app.get('sessionService').kick(uid, cb);
  //   }, function(cb) {
  //     session.bind(uid, cb);
  //   }, function(cb) {
  //     if(!players || players.length === 0) {
  //       next(null, {code: Code.OK});
  //       return;
  //     }

  //     player = players[0];

  //     session.set('serverId', self.app.get('areaIdMap')[player.areaId]);
  //     session.set('playername', player.name);
  //     session.set('playerId', player.id);
  //     session.on('closed', onUserLeave.bind(null, self.app));
  //     session.pushAll(cb);
  //   }, function(cb) {
  //     self.app.rpc.chat.chatRemote.add(session, player.userId, player.name,
  //       channelUtil.getGlobalChannelName(), cb);
  //   }
  // ], function(err) {
  //   if(err) {
  //     next(err, {code: Code.FAIL});
  //     return;
  //   }

  //   next(null, {code: Code.OK, player: players ? players[0] : null});
  // });
};

var onUserLeave = function(app, session, reason) {
  if (session && session.uid) {
    app.rpc.area.playerRemote.playerLeave(session, {
      playerId: session.get('playerId'),
      areaId: session.get('areaId')
    }, null);
  }
};

module.exports = function(app) {
  return bearcat.getBean({
    id: "entryHandler",
    func: EntryHandler,
    args: [{
      name: "app",
      value: app
    }]
  });
};