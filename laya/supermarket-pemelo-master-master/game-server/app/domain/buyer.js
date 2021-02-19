/**
 * Module dependencies
 */

var util = require('util');
var Persistent = require('./persistent');
var Underscore = require('underscore');

/**
 * Initialize a new 'Buyer' with the given 'opts'.
 * Buyer inherits Persistent
 *
 * @param {Object} opts
 * @api public
 */


var Buyer = function(opts) {
	Persistent.call(this, opts);
  	this.playerId = opts.playerId;
  	this.buyerId = opts.buyerId;
  	this.level = opts.level || 1;
};

util.inherits(Buyer, Persistent);
/**
 * Expose 'Buyer' constructor.
 */
module.exports = Buyer;
