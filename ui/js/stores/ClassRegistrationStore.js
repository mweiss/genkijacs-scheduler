"use strict";

var assign = require("object-assign");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var SchedulerConstants = require("../constants/SchedulerConstants");
var FluxStore = require("./FluxStore");
var _ = require("underscore");

var studentIdCache = {};
var classIdCache = {};

function insertIntoCache(cache, id, value) {
  var arr = cache[id];
  if (arr) {
    arr.push(value);
  }
  else {
    cache[id] = [value];
  }
}

function deleteFromCache(cache, id, value) {
  var arr = cache[id];
  if (arr) {
    cache[id] = _.filter(arr, function(v) { 
      return v.studentId !== value.studentId && v.classId !== value.classId;
    });
  }
}

var ClassRegistrationStore = assign(FluxStore.createStore(), {
  initEntity: function() {
    return {
      "classId": "",
      "studentId": "",
      "start": "",
      "end": ""
    };
  },

  findByStudentId: function(studentId) {
    return studentIdCache[studentId];
  },

  removeFromCache: function(v) {
    deleteFromCache(studentIdCache, v.studentId, v);
    deleteFromCache(classIdCache, v.classId, v);
  },

  saveAssociations: function(student) {
    var classes = student.editData.classes;
    if (classes) {
      var oldAssocs = this.findByStudentId(student.id) || [];
      _.each(oldAssocs, function(v) { this.del(v, true); }, this);
      _.each(classes, function(v) { this.save(v, true); }, this);
      this.emitChange();      
    }
  },

  addToCache: function(v) {
    insertIntoCache(studentIdCache, v.studentId, v);
    insertIntoCache(classIdCache, v.classId, v);
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case SchedulerConstants.STUDENT_SAVE:
      ClassRegistrationStore.saveAssociations(action.row);
      break;

    case SchedulerConstants.CLASS_REGISTRATION_SAVE:
      ClassRegistrationStore.save(action.row);
      break;

    case SchedulerConstants.CLASS_REGISTRATION_NEW:
      ClassRegistrationStore.append();
      break;

    case SchedulerConstants.CLASS_REGISTRATION_EDIT:
      ClassRegistrationStore.edit(action.row);
      break;
      
    default:
      // no op
  }
});

ClassRegistrationStore.setAll([{
  classId: 1,
  studentId: 1,
  start: "2015-01-03T00:00:00.000Z",
  end: "2015-05-30T00:00:00.000Z"
},
{
  classId: 3,
  studentId: 1,
  start: "2015-01-03T00:00:00.000Z",
  end: "2015-02-28T00:00:00.000Z"
},
{
  classId: 1,
  studentId: 2,
  start: "2015-01-10T00:00:00.000Z",
  end: "2015-06-12T00:00:00.000Z"
}]);

module.exports = ClassRegistrationStore;