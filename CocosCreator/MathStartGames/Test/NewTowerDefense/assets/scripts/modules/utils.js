var utils = {
    random_int: function(start, end) {
        var num = Math.floor(start + Math.random() * (end - start + 1));
        if (num > end) {
            num = end;
        }
        return num;
    }
};
module.exports = utils;