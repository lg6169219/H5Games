// var util = require('util');

// var Utils = function() {

// }

// // callback util
// Utils.prototype.invokeCallback = function(cb) {
// 	if (!!cb && typeof cb == 'function') {
// 		cb.apply(null, Array.prototype.slice.call(arguments, 1));
// 	}
// };

// //generate a random number between min and max
// Utils.prototype.rand = function(min, max) {
// 	var n = max - min;
// 	return min + Math.round(Math.random() * n);
// };

// // clone a object
// Utils.prototype.clone = function(o) {
// 	var n = {};
// 	for (var k in o) {
// 		n[k] = o[k];
// 	}

// 	return n;
// };

// module.exports = {
// 	id: "utils",
// 	func: Utils
// }

var utils = module.exports;

// control variable of func "myPrint"
var isPrintFlag = false;
// var isPrintFlag = true;

/**
 * Check and invoke callback function
 */
utils.invokeCallback = function(cb) {
  if(!!cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1));
  }
};

/**
 * clone an object
 */
utils.clone = function(origin) {
  if(!origin) {
    return;
  }

  var obj = {};
  for(var f in origin) {
    if(origin.hasOwnProperty(f)) {
      obj[f] = origin[f];
    }
  }
  return obj;
};
