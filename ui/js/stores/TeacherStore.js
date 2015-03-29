"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var TeacherConstants = require("../constants/TeacherConstants");
var assign = require("object-assign");

var CHANGE_EVENT = "change";

// For now, the teachers are hardcoded in an array. TODO:
// improve to id mapped array, fetch or update from
// server, although that might not be directly done by the store
var _teachers = [{
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
    }];

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
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case TeacherConstants.TEACHER_CREATE:
      break;

    case TeacherConstants.TEACHER_UPDATE:
      break;

    default:
      // no op
  }
});

module.exports = TeacherStore;