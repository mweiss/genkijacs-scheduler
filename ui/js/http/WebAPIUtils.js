'use strict';

var reqwest = require('reqwest');

var _requestQueue = [];

// TODO: Hardcoding the url for now... but this needs to be dynamic
// or everything needs to be relative
var BASE_URL = 'http://localhost:3000';

function makeRequest(config) {
  var url = config.url;
  config.url = BASE_URL + (url.charAt(0) === '/' ? '' : '/') + url;
  reqwest(config);
}

module.exports = {
  makeRequest: makeRequest
};
