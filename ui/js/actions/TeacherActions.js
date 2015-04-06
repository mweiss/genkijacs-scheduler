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

  save: function(teacher) {
    WebAPIUtils.makeRequest({
      url: '/teachers',
      method: 'post',
      data: teacher,
      success: function(resp) {
        console.log('TA.update.success', resp);
      }
    });

    AppDispatcher.dispatch({
      actionType: SchedulerConstants.TEACHER_SAVE,
      row: teacher
    });
  },

  new: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.TEACHER_NEW
    });
  }

};

module.exports = TeacherActions;