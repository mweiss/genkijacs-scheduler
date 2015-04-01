'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');

var StudentActions = {

  save: function(student) {
    WebAPIUtils.makeRequest({
      url: '/students',
      method: 'post',
      data: student,
      success: function(resp) {
        console.log('SA.update.success', resp);
      }
    });

    AppDispatcher.dispatch({
      actionType: SchedulerConstants.STUDENT_SAVE,
      row: student
    });
  },

  new: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.STUDENT_NEW
    });
  }

};

module.exports = StudentActions;