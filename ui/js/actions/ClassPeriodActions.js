'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');

// TODO: Classes, student and teacher actions are very very similar... we can probably combine them
var ClassPeriodActions = {

  edit: function(cl) {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_PERIOD_EDIT,
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
      actionType: SchedulerConstants.CLASS_PERIOD_SAVE,
      row: cl
    });
  },

  new: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_PERIOD_NEW
    });
  }

};

module.exports = ClassPeriodActions;