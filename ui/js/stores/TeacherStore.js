"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var TeacherConstants = require("../constants/TeacherConstants");
var assign = require("object-assign");
var _ = require("underscore");

var CHANGE_EVENT = "change";

// For now, the teachers are hardcoded in an array. TODO:
// improve to id mapped array, fetch or update from
// server, although that might not be directly done by the store
var _teachers = [];
var _teacherMap = {};

var _id_counter = 0;

// TODO: figure out what the right colors are for this
var _colors = ["#F0F8FF", "#FAEBD7", "#00FFFF"];

function incrementCounter() {
  return _id_counter++;
}


var TeacherStore = assign({}, EventEmitter.prototype, {

  getAllTeachers: function() {
    return _teachers;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  updateTeacher: function(data) {
    var old = _teacherMap[data.ui_id];
    if (old) {
      _.extend(old, data);
      if (old._new) {
        old._new = false;
      }
      this.emitChange();
    }
  },

  setTeachers: function(teachers) {
    _teachers = teachers;
    _teacherMap = {};
    _.each(teachers, function(t) {
      t.ui_id = incrementCounter();
      _teacherMap[t.ui_id] = t;
    });
    this.emitChange();
  },

  addNewTeacher: function() {
    var ui_id = incrementCounter();

    var teacher = {
      "ui_id": ui_id,
      "name_jp": "",
      "name_en": "",
      "_new": true,
      "color": _colors[ui_id % _colors.length],
      "classHours": 32,
      "privateHours": 0,
      "groupHours": 11
    };

    _teachers.push(teacher);
    _teacherMap[ui_id] = teacher;

    this.emitChange();
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case TeacherConstants.TEACHER_SAVE:
      TeacherStore.updateTeacher(action.row);
      break;

    case TeacherConstants.TEACHER_NEW:
      TeacherStore.addNewTeacher();
      break;

    default:
      // no op
  }
});

// TODO: this is just here to simulate a network request to the teacher store,
// I need to get this working for realz
TeacherStore.setTeachers([{
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