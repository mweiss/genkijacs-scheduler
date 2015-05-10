'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');
var ActionUtils = require('./ActionUtils');

// TODO: Class, student and teacher actions are very very similar... we can probably combine them
var ClassActions = {

  edit: function(cl) {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_EDIT,
      row: cl
    });
  },

  discard: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_DISCARD
    });
  },

  save: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_VALIDATE_AND_SAVE,
      success: ActionUtils.createEditCallback('/classes', SchedulerConstants.CLASS_UPDATE_IDS)
    });
  },

  newRow: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.CLASS_NEW
    });
  }

};

module.exports = ClassActions;