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
      "name_jp": "",
      "name_en": "",
      "color": _colors[ui_id % _colors.length],
      "classHours": 32,
      "privateHours": 0,
      "groupHours": 11
    };
  },
  validateObject: function(obj) {
    var errors = [];
    this.validateRequire(obj, ["name_jp", "name_en"], errors);
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
      
    default:
      // no op
  }
});

// TODO: this is just here to simulate a network request to the teacher store,
// I need to get this working for realz
TeacherStore.setAll([{
      "id":1, 
      "name_jp": "ともえ",
      "name_en": "Tomoe",
      "color": "#ff0000",
      "classHours": 10000,
      "privateHours": 3,
      "groupHours": 4
    },
    {
      "id":2, 
      "name_jp": "みめい",
      "name_en": "Mimei",
      "color": "#00ff00",
      "classHours": 9,
      "privateHours": 3,
      "groupHours": 0
    },
    {
      "id":3, 
      "name_jp": "夏子",
      "name_en": "Natsuko",
      "color": "#0000ff",
      "classHours": 32,
      "privateHours": 0,
      "groupHours": 11
    }]);

module.exports = TeacherStore;