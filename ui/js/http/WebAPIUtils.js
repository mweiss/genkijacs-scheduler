'use strict';

var reqwest = require('reqwest');

var _requestQueue = [];

// TODO: Hardcoding the url for now... but this needs to be dynamic
// or everything needs to be relative

function makeRequest(config) {
  reqwest(config);
}

module.exports = {
  makeRequest: makeRequest
};
