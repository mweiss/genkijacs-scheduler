'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');
var ActionUtils = require('./ActionUtils');

var TeacherActions = {

  edit: function(cl) {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.TEACHER_EDIT,
      row: cl
    });
  },

  discard: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.TEACHER_DISCARD
    });
  },

  save: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.TEACHER_VALIDATE_AND_SAVE,
      success: ActionUtils.createEditCallback('/teachers', SchedulerConstants.TEACHER_UPDATE_IDS)
    });
  },

  newRow: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.TEACHER_NEW
    });
  }

};

module.exports = TeacherActions;