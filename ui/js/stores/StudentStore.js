"use strict";

var assign = require("object-assign");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var SchedulerConstants = require("../constants/SchedulerConstants");
var FluxStore = require("./FluxStore");

var StudentStore = assign(FluxStore.createStore(), {
  initEntity: function(ui_id) {
    return {
      "firstname_jp": "",
      "firstname_en": "",
      "lastname_jp": "",
      "lastname_en": "",
      "enrollment_intervals": [],
      "primary_lang": "",
      "country": "",
      "japanese_level": "",
      "notes": "",
      "birthday": "1986-03-14T00:00:00.000Z"
    };
  },

  validateObject: function(obj) {
    var errors = [];
    this.validateRequire(obj, ["firstname_jp", "firstname_en", "lastname_jp", "lastname_en"], errors);
    return errors;
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case SchedulerConstants.STUDENT_VALIDATE_AND_SAVE:
      StudentStore.validateAndSave(action.success);
      break;

    case SchedulerConstants.STUDENT_NEW:
      StudentStore.append();
      break;

    case SchedulerConstants.STUDENT_EDIT:
      StudentStore.edit(action.row);
      break;

    case SchedulerConstants.STUDENT_DISCARD:
      StudentStore.discard();
      break;

    case SchedulerConstants.STUDENT_LOAD:
      StudentStore.load(action.data);
      break;

    case SchedulerConstants.STUDENT_LOAD_ERROR:
      StudentStore.loadError();
      break;

    case SchedulerConstants.STUDENT_UPDATE_IDS:
      StudentStore.updateIds(action.data);
      break;
      
    default:
      // no op
  }
});

module.exports = StudentStore;