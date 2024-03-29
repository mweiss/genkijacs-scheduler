"use strict";

var assign = require("object-assign");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var SchedulerConstants = require("../constants/SchedulerConstants");
var FluxStore = require("./FluxStore");

// TODO: figure out what the right colors are for this
var _colors = ["#F0F8FF", "#FAEBD7", "#00FFFF"];

var TeacherStore = assign(FluxStore.createStore(), {
  initEntity: function(ui_id) {
    return {
      "firstname_jp": "",
      "firstname_en": "",
      "lastname_jp": "",
      "lastname_en": "",
      "color": _colors[ui_id % _colors.length],
      "classHours": 0,
      "privateHours": 0,
      "groupHours": 0
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
    case SchedulerConstants.TEACHER_VALIDATE_AND_SAVE:
      TeacherStore.validateAndSave(action.success);
      break;

    case SchedulerConstants.TEACHER_NEW:
      TeacherStore.append();
      break;

    case SchedulerConstants.TEACHER_EDIT:
      TeacherStore.edit(action.row);
      break;

    case SchedulerConstants.TEACHER_DISCARD:
      TeacherStore.discard();
      break;

    case SchedulerConstants.TEACHER_LOAD:
      TeacherStore.load(action.data);
      break;

    case SchedulerConstants.TEACHER_LOAD_ERROR:
      TeacherStore.loadError();
      break;

    case SchedulerConstants.TEACHER_UPDATE_IDS:
      TeacherStore.updateIds(action.data);
      break;

    default:
      // no op
  }
});

module.exports = TeacherStore;