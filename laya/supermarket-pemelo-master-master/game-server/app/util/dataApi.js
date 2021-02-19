// require json files
var area = require('../../config/data/area');
var role = require('../../config/data/role');
var treasure = require('../../config/data/treasure');
var testjson = require('../../config/data/ordergoods');
/**
 * Data model `new Data()`
 *
 * @param {Array}
 */
var DataApi = function(data) {
  var fields = {};
  data[1].forEach(function(i, k) {
    fields[i] = k;
  });
  data.splice(0, 2);

  var result = {},
    ids = [],
    item;
  data.forEach(function(k) {
    item = mapData(fields, k);
    result[item.id] = item;
    ids.push(item.id);
  });

  this.data = result;
  this.ids = ids;
};

/**
 * map the array data to object
 *
 * @param {Object}
 * @param {Array}
 * @return {Object} result
 * @api private
 */
var mapData = function(fields, item) {
  var obj = {};
  for (var k in fields) {
    obj[k] = item[fields[k]];
  }
  return obj;
};

/**
 * find items by attribute
 *
 * @param {String} attribute name
 * @param {String|Number} the value of the attribute
 * @return {Array} result
 * @api public
 */
DataApi.prototype.findBy = function(attr, value) {
  var result = [];
  //console.log(' findBy ' + attr + '  value:' + value + '  index: ' + index);
  var i, item;
  for (i in this.data) {
    item = this.data[i];
    if (item[attr] == value) {
      result.push(item);
    }
  }
  return result;
};

/**
 * find item by id
 *
 * @param id
 * @return {Obj}
 * @api public
 */
DataApi.prototype.findById = function(id) {
  return this.data[id];
};

DataApi.prototype.random = function() {
  var length = this.ids.length;
  var rid = this.ids[Math.floor(Math.random() * length)];
  return this.data[rid];
};

/**
 * find all item
 *
 * @return {array}
 * @api public
 */
DataApi.prototype.all = function() {
  return this.data;
};

var DataApiUtil = function() {
  this.areaData = null;
  this.roleData = null;
  this.treasureData = null;
  this.testData = null;
}

DataApiUtil.prototype.area = function() {
  if (this.areaData) {
    return this.areaData;
  }

  this.areaData = new DataApi(area);
  return this.areaData;
}

DataApiUtil.prototype.role = function() {
  if (this.roleData) {
    return this.roleData;
  }

  this.roleData = new DataApi(role);
  return this.roleData;
}

DataApiUtil.prototype.treasure = function() {
  if (this.treasureData) {
    return this.treasureData;
  }

  this.treasureData = new DataApi(treasure);
  return this.treasureData;
}

var loadOrderGoods = function() {
  var cfgData = {};
  for (var v in testjson){
    var jdata = testjson[v];

    var specialArr = [];
    var rateSum = 0;
    for (var i = 1; i <= 4; i++){
      var goodid = jdata["special" + "GoodID" + i];
      var num = jdata["special" + "number" + i];
      var times = jdata["special" + "Times" + i];
      var rate = jdata["special" + "Rate" + i];
      var data = {};
      if (goodid){
        data.goodid = goodid;
        data.num = num;
        data.times = times;
        data.rate = rate;
        rateSum = rateSum + rate;
        specialArr.push(data);
      }
    }
    jdata.specialRateSum = rateSum;
    jdata.specialArr = specialArr;

    var superArr = [];
    rateSum = 0;
    for (var i = 1; i <= 4; i++){
      var goodid = jdata["super" + "GoodID" + i];
      var num = jdata["super" + "number" + i];
      var times = jdata["super" + "Times" + i];
      var rate = jdata["super" + "Rate" + i];
      var data = {};
      if (goodid){
        data.goodid = goodid;
        data.num = num;
        data.times = times;
        data.rate = rate;
        rateSum = rateSum + rate;
        superArr.push(data);
      }
    }
    jdata.superRateSum = rateSum;
    jdata.superArr = superArr;

    var normalArr = [];
    for (var i = 1; i <= 10; i++){
      var goodid = jdata["goodID" + i];
      var num = jdata["number" + i];
      var times = jdata["times" + i];
      var data = {};
      if (goodid){
        data.goodid = goodid;
        data.num = num;
        data.times = times;
        normalArr.push(data);
      }
    }
    jdata.normalArr = normalArr;
  }
};

loadOrderGoods();

DataApiUtil.prototype.test = function() {
  if (this.testData) {
    return this.testData;
  }
  this.testData = testjson;
  return this.testData;
}

module.exports = {
  id: "dataApiUtil",
  func: DataApiUtil
}
// module.exports = {
//   area: new DataApi(area),
//   role: new DataApi(role),
//   treasure: new DataApi(treasure)
// };