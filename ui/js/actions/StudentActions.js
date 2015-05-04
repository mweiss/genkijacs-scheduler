'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');
var ClassRegistrationStore = require("../stores/ClassRegistrationStore");
var _ = require("underscore");

var StudentActions = {

  edit: function(cl) {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.STUDENT_EDIT,
      row: cl
    });
  },

  save: function() {
    /*
    WebAPIUtils.makeRequest({
      url: '/students',
      method: 'post',
      data: student,
      success: function(resp) {
        console.log('SA.update.success', resp);
      }
    });
    */

    AppDispatcher.dispatch({
      actionType: SchedulerConstants.STUDENT_VALIDATE_AND_SAVE,
      success: function(values) {
        // Save the students and class registrations
        // update the class registrations.  TODO, for now, we'll just update class regs
        _.each(values, function(v) {
          ClassRegistrationStore.saveAssociations(v);
        });
      }
    });
  },

  newRow: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.STUDENT_NEW
    });
  }

};

module.exports = StudentActions;