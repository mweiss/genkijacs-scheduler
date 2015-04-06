'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');

var AppActions = {
  click: function(ev) {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.APP_CLICK,
      event: ev
    });
  }
};

module.exports = AppActions;