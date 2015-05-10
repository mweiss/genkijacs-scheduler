"use strict";

var assign = require("object-assign");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var SchedulerConstants = require("../constants/SchedulerConstants");
var FluxStore = require("./FluxStore");

var ClassStore = assign(FluxStore.createStore(), {
  initEntity: function(ui_id) {
    return {
      "name_jp": "",
      "name_en": "",
      "type": "normal" // todo: enumerate the class types
    };
  },
  validateObject: function(obj) {
    var errors = [];
    this.validateRequire(obj, ["name_jp", "name_en"], errors);
    return errors;
  }
});

// TODO: This seems similar to teacher and student, perhaps we can combine the abstraction?
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case SchedulerConstants.CLASS_VALIDATE_AND_SAVE:
      ClassStore.validateAndSave(action.success);
      break;

    case SchedulerConstants.CLASS_NEW:
      ClassStore.append();
      break;

    case SchedulerConstants.CLASS_EDIT:
      ClassStore.edit(action.row);
      break;

    case SchedulerConstants.CLASS_DISCARD:
      ClassStore.discard();
      break;

    case SchedulerConstants.CLASS_LOAD:
      ClassStore.load(action.data);
      break;

    case SchedulerConstants.CLASS_LOAD_ERROR:
      ClassStore.loadError();
      break;

    default:
      // no op
  }
});

module.exports = ClassStore;