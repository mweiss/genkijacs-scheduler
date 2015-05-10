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
      return v.student_id !== value.student_id && v.class_id !== value.class_id;
    });
  }
}

var ClassRegistrationStore = assign(FluxStore.createStore(), {
  initEntity: function() {
    return {
      "class_id": "",
      "student_id": "",
      "start": "",
      "end": ""
    };
  },

  findByStudentId: function(studentId) {
    return studentIdCache[studentId];
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

  removeFromCache: function(v) {
    deleteFromCache(studentIdCache, v.student_id, v);
    deleteFromCache(classIdCache, v.class_id, v);
  },

  addToCache: function(v) {
    insertIntoCache(studentIdCache, v.student_id, v);
    insertIntoCache(classIdCache, v.class_id, v);
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
    
    case SchedulerConstants.CLASS_REGISTRATION_LOAD:
      ClassRegistrationStore.load(action.data);
      break;

    case SchedulerConstants.CLASS_REGISTRATION_LOAD_ERROR:
      ClassRegistrationStore.loadError();
      break;
      
    case SchedulerConstants.CLASS_REGISTRATION_UPDATE_IDS:
      ClassRegistrationStore.updateIds(action.data);
      break;

    default:
      // no op
  }
});

module.exports = ClassRegistrationStore;