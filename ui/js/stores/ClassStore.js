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
      
    default:
      // no op
  }
});

// TODO: this is just here to simulate a network request to the class store,
// I need to get this working for realz
ClassStore.setAll([{
  "id": 1, 
  "name_jp": "原宿",
  "name_en": "Harajuku",
  "type": "normal"
},
{
  "id":2, 
  "name_jp": "浅草",
  "name_en": "Asakusa",
  "type": "normal"
},
{
  "id":3, 
  "name_jp": "会話授業",
  "name_en": "Conversation A",
  "type": "conversation"
}]);

module.exports = ClassStore;