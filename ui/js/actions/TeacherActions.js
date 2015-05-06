'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');

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

  save: function(teacher) {
    /*
    WebAPIUtils.makeRequest({
      url: '/teachers',
      method: 'post',
      data: teacher,
      success: function(resp) {
        console.log('TA.update.success', resp);
      }
    });
    */

    AppDispatcher.dispatch({
      actionType: SchedulerConstants.TEACHER_VALIDATE_AND_SAVE,
      success: function() {
        console.log('success!');
      }
    });
  },

  newRow: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.TEACHER_NEW
    });
  }

};

module.exports = TeacherActions;