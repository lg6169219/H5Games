var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var Buyer = require('../domain/buyer');
var utils = require('../util/utils');

var buyersDao = module.exports;

/**
 * Create buyer
 *
 * @param {Number} playerId Player id.
 * @param {function} cb Callback function
 */
buyersDao.createBuyers = function (playerId, buyerId, level, cb) {
	var sql = 'insert into buyer (playerId, buyerId, level) values (?, ?, ?)';
	var args = [playerId, buyerId, level || 1];

	pomelo.app.get('dbclient').insert(sql, args, function(err, res) {
		if (err) {
			logger.error('create Buyer for BuyerDao failed! ' + err.stack);
			utils.invokeCallback(cb, err, null);
		} else {
			var buyer = new Buyer({ id: res.insertId });
			utils.invokeCallback(cb, null, buyer);
		}
	});
};

buyersDao.unlockBuyers = function (playerId, cb) {
	var unlockIds = [101, 102, 103];
	for (var i = 0; i < unlockIds.length; i ++){
		buyersDao.createBuyers(playerId, unlockIds[i], 1, cb);
	}
};

/**
 * Get player's equipment by playerId
 *
 * @param {Number} playerId
 * @param {funciton} cb
 */
buyersDao.getBuyersByPlayerId = function(playerId, cb) {
	var sql = 'select * from buyer where playerId = ?';
	var args = [playerId];
	console.log("=========getBuyersByPlayerId", playerId);
	pomelo.app.get('dbclient').query(sql, args, function(err, res) {
		if (err) {
			logger.error('get Buyer by playerId for buyersDao failed! ' + err.stack);
			utils.invokeCallback(cb, err, null);
		} else {
			console.log("=========res", res);
			if (res && res.length >= 1) {
				var buyerList = {};
				for (var i = 0; i < res.length; i++){
					var data = res[i];
					buyerList[data.buyerId] = {buyerId : data.buyerId, level : data.level, playerId : data.playerId};
				}
				utils.invokeCallback(cb, null, buyerList);
			} else {
				logger.error('Buyer not exist!! ' );
				utils.invokeCallback(cb, new Error('Buyer not exist '));
			}
		}
	});
};

/**
 * Updata Buyer
 * @param {Object} val Update params, in a object.
 * @param {function} cb
 */
buyersDao.update = function(val, cb) {
	var sql = 'update buyer set level = ? where id = ?';
	var args = [val.level, val.id];

	pomelo.app.get('dbclient').query(sql, args, function(err, res) {
		utils.invokeCallback(cb, err, res);
	});
};

/**
 * destroy Buyer
 *
 * @param {number} playerId
 * @param {function} cb
 */
buyersDao.destroy = function(playerId, cb) {
	var sql = 'delete from buyer where playerId = ?';
	var args = [playerId];

	pomelo.app.get('dbclient').query(sql, args, function(err, res) {
		utils.invokeCallback(cb, err, res);
	});
};