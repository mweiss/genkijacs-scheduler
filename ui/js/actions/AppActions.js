'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');

function loadStore(successAction, failureAction, url) {
  WebAPIUtils.makeRequest({
    url: '/classes',
    method: 'get',
    success: function(resp) {
      var d = JSON.parse(resp);
      AppDispatcher.dispatch({
        actionType: successAction,
        data: d
      });
    },

    failure: function() {
      AppDispatcher.dispatch({
        actionType: failureAction
      });
    }
  });
}

var AppActions = {
  load: function(ev) {
    loadStore(SchedulerConstants.TEACHER_LOAD, SchedulerConstants.TEACHER_LOAD_ERROR, '/teachers');
    loadStore(SchedulerConstants.STUDENT_LOAD, SchedulerConstants.STUDENT_LOAD_ERROR, '/students');
    loadStore(SchedulerConstants.CLASS_LOAD, SchedulerConstants.CLASS_LOAD_ERROR, '/classes');
    loadStore(SchedulerConstants.ROOM_LOAD, SchedulerConstants.ROOM_LOAD_ERROR, '/rooms');
    loadStore(SchedulerConstants.CLASS_REGISTRATION_LOAD, SchedulerConstants.CLASS_REGISTRATION_ERROR, '/class-registrations');
    loadStore(SchedulerConstants.CLASS_PERIOD_LOAD, SchedulerConstants.CLASS_PERIOD_LOAD_ERROR, '/class-periods');
  }
};

module.exports = AppActions;