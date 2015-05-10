'use strict';

module.exports = {
  chainPromises: function (promises, next) {
    var i = 1, results = [];

    function chain(res) {
      results.push(res);
      if (i < promises.length) {
        promises[i].then(chain);
        i += 1;
      }
      else {
        next(results);
      }
    }

    if (promises.length === 0) {
      next(results);
    }
    else {
      promises[0].then(chain);
    }
  }
}