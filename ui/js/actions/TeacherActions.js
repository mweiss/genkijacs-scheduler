'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TeacherConstants = require('../constants/TeacherConstants');
var WebAPIUtils = require('../http/WebAPIUtils');

var TeacherActions = {

  /**
   * Covers both the edit and save events.
   */
  save: function(teacher) {
    WebAPIUtils.makeRequest({
      url: '/teachers',
      method: 'post',
      data: teacher,
      success: function(resp) {
        console.log('TA.update.success', resp)
      }
    });

    AppDispatcher.dispatch({
      actionType: TeacherConstants.TEACHER_SAVE,
      row: teacher
    });
  },

  new: function() {
    AppDispatcher.dispatch({
      actionType: TeacherConstants.TEACHER_NEW
    });
  }

};

module.exports = TeacherActions;