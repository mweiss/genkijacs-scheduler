'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TeacherConstants = require('../constants/TeacherConstants');
var WebAPIUtils = require('../http/WebAPIUtils');

var TeacherActions = {
  update: function(teacher) {
    WebAPIUtils.makeRequest({
      url: '/teachers/edit',
      method: 'post',
      data: { foo: 'bar', baz: 100 },
      success: function(resp) {
        console.log('TA.update.success', resp)
      }
    });

    AppDispatcher.dispatch({
      actionType: TeacherConstants.TEACHER_UPDATE,
      id: teacher.id,
      row: teacher
    });
  },

  create: function(teacher) {
    AppDispatcher.dispatch({
      actionType: TeacherConstants.TEACHER_CREATE,
      row: teacher
    });
  }
};

module.exports = TeacherActions;