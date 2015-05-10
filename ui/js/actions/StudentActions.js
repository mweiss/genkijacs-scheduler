'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');
var ActionUtils = require('./ActionUtils');

var ClassRegistrationStore = require("../stores/ClassRegistrationStore");
var _ = require("underscore");

var StudentActions = {

  edit: function(cl) {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.STUDENT_EDIT,
      row: cl
    });
  },

  discard: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.STUDENT_DISCARD
    });
  },

  save: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.STUDENT_VALIDATE_AND_SAVE,
      success: function(values) {
        var savedValues = _.map(values, function(v) {
          return {id: v.id, editData: v.editData};
        });

        var callback = ActionUtils.createEditCallback('/students', SchedulerConstants.STUDENT_UPDATE_IDS, function(ids) {
          // Update the students ids on the class registrations
          _.each(ids, function(id) {
            var sv = savedValues[id.idx]
            if (sv.editData.classes) {
              sv.id = id.id;
              _.each(sv.editData.classes, function(cr) {
                cr.student_id = id.id;
              });  
            }
          });

          _.each(savedValues, function(v) {
            if (v.editData.classes) {
              ClassRegistrationStore.saveAssociations(v);
            }
          });
        });

        callback(values);
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