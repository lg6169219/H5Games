var EventEmitter = require('events').EventEmitter;
var util = require('util');

var id = 1;

/**
 * Initialize a new 'Entity' with the given 'opts'.
 * Entity inherits EventEmitter
 *
 * @param {Object} opts
 * @api public
 */
function Entity(opts) {
	EventEmitter.call(this);
	this.opts = opts || {};
	this.entityId = id++;
	this.kindId = opts.kindId;
	this.kindName = opts.kindName;
	this.areaId = opts.areaId || 1;
	this.x = 0;
	this.y = 0;
}

util.inherits(Entity, EventEmitter);

Entity.prototype._init = function() {
	var opts = this.opts;

}

Entity.prototype._toJSON = function() {
	return {
		x: this.x,
		y: this.y,
		entityId: this.entityId,
		kindId: this.kindId,
		kindName: this.kindName,
		areaId: this.areaId
	}
}


/**
 * Get state
 *
 * @return {Object}
 * @api public
 */
Entity.prototype.getPos = function() {
	return {
		x: this.x,
		y: this.y
	};
};

/**
 * Set positon of this entityId
 *
 * @param {Number} x
 * @param {Number} y
 * @api public
 */
Entity.prototype.setPos = function(x, y) {
	this.x = x;
	this.y = y;
};

module.exports = {
	id: "entity",
	func: Entity,
	abstract: true,
	props: [{
		name: "dataApiUtil",
		ref: "dataApiUtil"
	}, {
		name: "utils",
		ref: "utils"
	}]
}