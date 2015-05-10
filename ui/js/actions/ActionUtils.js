'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var WebAPIUtils = require('../http/WebAPIUtils');
var _ = require('underscore');

function createEditCallback(url, updateIdAction, idUpdateCallback) {
  return function(values) {
    var dataToPost = _.map(values, function(v) {
      if (v._new) {
        return _.extend({}, _.omit(v, "editData", "_new", "_delete"), v.editData);
      }
      return v.editData;
    });
    WebAPIUtils.makeRequest({
      url: url,
      method: 'post',
      type: 'json',
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify(dataToPost),
      success: function(ids) {
        var data = ids.map(function(id) {
          return {
            id: id.id,
            ui_id: values[id.idx].ui_id
          };
        });
        if (idUpdateCallback) {
          idUpdateCallback(ids);
        }
        AppDispatcher.dispatch({
          actionType: updateIdAction,
          data: data
        });
      }
    });
  } 
}

module.exports = {
  createEditCallback: createEditCallback
};