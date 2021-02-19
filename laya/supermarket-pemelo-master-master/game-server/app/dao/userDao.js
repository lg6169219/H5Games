var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var Player = require('../domain/player');
var consts = require('../consts/consts');
var buyersDao = require('./buyersDao');
var async = require('async');
var utils = require('../util/utils');
var consts = require('../consts/consts');
var bearcat = require('bearcat');
var userDao = module.exports;

/**
 * Get user data by username.
 * @param {String} username
 * @param {String} passwd
 * @param {function} cb
 */
userDao.getUserInfo = function (username, passwd, cb) {
	var sql = 'select * from User where name = ?';
	var args = [username];

	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err !== null) {
				utils.invokeCallback(cb, err, null);
		} else {
			var userId = 0;
			if (!!res && res.length === 1) {
				var rs = res[0];
				userId = rs.id;
				rs.uid = rs.id;
				utils.invokeCallback(cb,null, rs);
			} else {
				utils.invokeCallback(cb, null, {uid:0, username: username});
			}
		}
	});
};

/**
 * Get an user's all players by userId
 * @param {Number} uid User Id.
 * @param {function} cb Callback function.
 */
userDao.getPlayersByUid = function(uid, cb){
	var sql = 'select * from Player where userId = ?';
	var args = [uid];

	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err.message, null);
			return;
		}

		if(!res || res.length <= 0) {
			utils.invokeCallback(cb, null, []);
			return;
		} else {
			utils.invokeCallback(cb, null, res);
		}
	});
};

/**
 * Get an user's all players by userId
 * @param {Number} playerId
 * @param {function} cb Callback function.
 */
userDao.getPlayer = function(playerId, cb){
	var sql = 'select * from Player where id = ?';
	var args = [playerId];

	pomelo.app.get('dbclient').query(sql,args,function(err, res){
		if(err !== null){
			utils.invokeCallback(cb, err.message, null);
		} else if (!res || res.length <= 0){
			utils.invokeCallback(cb,null,[]);
			return;
		} else{
			utils.invokeCallback(cb,null, new Player(res[0]));
		}
	});
};

/**
 * get by Name
 * @param {String} name Player name
 * @param {function} cb Callback function
 */
userDao.getPlayerByName = function(name, cb){
	var sql = 'select * from Player where name = ?';
	var args = [name];

	pomelo.app.get('dbclient').query(sql,args,function(err, res){
		console.log("========utils.invokeCallback", utils);
		if (err !== null){
			utils.invokeCallback(cb, err.message, null);
		} else if (!res || res.length <= 0){
			utils.invokeCallback(cb, null, null);
		} else{
			var player = {
			    userId: res[0].userId,
			    name: res[0].name,
			    gold: res[0].gold,
			    money: res[0].money,
			    vit: res[0].vit,
			    exp: res[0].exp,
			    level: res[0].level
			  };
			utils.invokeCallback(cb,null, player);
		}
	});
};

/**
 * Get all the information of a player, include equipments, bag, skills, tasks.
 * @param {String} playerId
 * @param {function} cb
 */
userDao.getPlayerAllInfo = function (playerId, cb) {
	async.parallel([
		function(callback){
			userDao.getPlayer(playerId, function(err, player) {
				if(!!err || !player) {
					logger.error('Get user for userDao failed! ' + err.stack);
				}
				callback(err,player);
			});
		},
		function(callback){
			buyersDao.getBuyersByPlayerId(playerId, function(err, buyerList) {
				if(!!err) {
					logger.error('Get buyers for buyersDao failed!');
				}
				callback(err, buyerList);
			});
		}
	],
	function(err, results) {
		var player = results[0];
		var buyerList = results[1];
		// var equipments = results[1];
		// var bag = results[2];
		// var fightSkills = results[3];
		// var tasks = results[4];
		// player.bag = bag;
		// player.setEquipments(equipments);
		// player.addFightSkills(fightSkills);
		// player.curTasks = tasks || {};
		player.buyerList = buyerList;
		console.log("=======getPlayerAllInfo", player.buyerList);
		if (!!err){
			utils.invokeCallback(cb,err);
		}else{
			utils.invokeCallback(cb,null,player);
		}
	});
};



/**
 * Create a new player
 * @param {String} uid User id.
 * @param {String} name Player's name in the game.
 * @param {Number} roleId Player's roleId, decide which kind of player to create.
 * @param {function} cb Callback function
 */


userDao.createPlayer = function (uid, name, cb){
	var sql = 'insert into Player (userId, name, vit, money, gold, level, exp) values(?,?,?,?,?,?,?)';
	console.log("==========userDao.createPlayer", uid, name);
	var args = [uid, name, 100, 10000, 0, 1, 0];

	pomelo.app.get('dbclient').insert(sql, args, function(err,res){
		if(err !== null){
			logger.error('create player failed! ' + err.message);
			logger.error(err);
			utils.invokeCallback(cb,err.message, null);
		} else {
			  var player = bearcat.getBean('player', {
			    id: res.insertId,
			    name: name,
			    userId: uid,
			    money: 10000,
				gold: 0,
				level: 1,
				exp:0
			  });
			utils.invokeCallback(cb,null,player);
		}
	});
};

/**
 * Update a player
 * @param {Object} player The player need to update, all the propties will be update.
 * @param {function} cb Callback function.
 */
userDao.updatePlayer = function (player, cb){
	var sql = 'update Player set x = ? ,y = ? , hp = ?, mp = ? , maxHp = ?, maxMp = ?, country = ?, rank = ?, level = ?, experience = ?, areaId = ?, attackValue = ?, defenceValue = ?, walkSpeed = ?, attackSpeed = ? , skillPoint = ? where id = ?';
	var args = [player.x, player.y, player.hp, player.mp, player.maxHp, player.maxMp, player.country, player.rank, player.level, player.experience, player.areaId, player.attackValue, player.defenceValue, player.walkSpeed, player.attackSpeed, player.skillPoint, player.id];

	pomelo.app.get('dbclient').query(sql,args,function(err, res){
		if(err !== null){
			utils.invokeCallback(cb,err.message, null);
		} else {
			if (!!res && res.affectedRows>0) {
				utils.invokeCallback(cb,null,true);
			} else {
				logger.error('update player failed!');
				utils.invokeCallback(cb,null,false);
			}
		}
	});
};

/**
 * Delete player
 * @param {Number} playerId
 * @param {function} cb Callback function.
 */
userDao.deletePlayer = function (playerId, cb){
	var sql = 'delete from	Player where id = ?';
	var args = [playerId];
	pomelo.app.get('dbclient').query(sql,args,function(err, res){
		if(err !== null){
			utils.invokeCallback(cb,err.message, null);
		} else {
			if (!!res && res.affectedRows>0) {
				utils.invokeCallback(cb,null,true);
			} else {
				utils.invokeCallback(cb,null,false);
			}
		}
	});
};
