'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');

// TODO: Class, student and teacher actions are very very similar... we can probably combine them
var ClassActions = {

  edit: function(cl) {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_EDIT,
      row: cl
    });
  },

  save: function(cl) {
    /*
    WebAPIUtils.makeRequest({
      url: '/classes',
      method: 'post',
      data: cl,
      success: function(resp) {
        console.log('SA.update.success', resp);
      }
    });
*/

    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_VALIDATE_AND_SAVE,
      success: function() {
        console.log('success');
      }
    });
  },

  newRow: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_NEW
    });
  }

};

module.exports = ClassActions;