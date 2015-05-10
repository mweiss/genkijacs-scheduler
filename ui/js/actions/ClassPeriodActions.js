'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');
var ActionUtils = require('./ActionUtils');

// TODO: Classes, student and teacher actions are very very similar... we can probably combine them
var ClassPeriodActions = {

  edit: function(cl) {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_PERIOD_EDIT,
      row: cl
    });
  },

  save: function(cl) {
    var updateMethod = ActionUtils.createEditCallback('/class-periods', SchedulerConstants.CLASS_PERIOD_UPDATE_IDS);
    
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_PERIOD_SAVE,
      row: cl,
      success: updateMethod
    });
  },

  new: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_PERIOD_NEW
    });
  }

};

module.exports = ClassPeriodActions;