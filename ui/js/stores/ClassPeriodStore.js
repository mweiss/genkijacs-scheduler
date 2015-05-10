"use strict";

var assign = require("object-assign");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var SchedulerConstants = require("../constants/SchedulerConstants");
var FluxStore = require("./FluxStore");
var _ = require("underscore");

var dayToRoomMap = {};

function formatDayKey(date) {
  function two(n) {
    return (n < 10 ? "0" : "") + n;
  }
  return two(date.getDate()) + "/" + two(date.getMonth()) + "/" + two(date.getFullYear());
}

function startDateSort(a, b) {
  var ad = new Date(a.start_date);
  var bd = new Date(b.start_date);

  var time = bd.getTime() - ad.getTime();
  if (time > 0) {
    return 1;
  }
  else if (time < 0) {
    return -1;
  }
  else {
    return 0;
  }
}

var ClassPeriodStore = assign(FluxStore.createStore(), {
  initEntity: function() {
    return {
      "start_date": "",
      "end_date": "",
      "class_id": "",
      "room_id": "",
      "teacher_id": ""
    };
  },

  findByDay: function(date) {
    var dateKey = formatDayKey(date);
    return dayToRoomMap[dateKey] || {};
  },

  addToClassPeriodDayMap: function(row) {
    var start_date = row.start_date,
        end_date   = row.end_date,
        room_id    = row.room_id;

    var dateKey = formatDayKey(new Date(start_date));
    var dayBlock = dayToRoomMap[dateKey] || {};
    var classPeriods = dayBlock[room_id] || [];

    // For now, we"ll assume that the class periods will always be the same... so we"ll only
    // need to remove one at most
    var sameInterval = function(v) {
      return v.start_date === start_date && v.end_date === end_date;
    };

    var oldClassPeriod = _.find(classPeriods, sameInterval);
    if (oldClassPeriod) {
      if (oldClassPeriod.ui_id === row.ui_id) {
        this.removeFromDayToRoomMap(row);
      }
      else {
        this.del(oldClassPeriod);
      }
      // Fetch the room one more time
      classPeriods = dayBlock[room_id] || [];
    }

    classPeriods.push(row);
    classPeriods.sort(startDateSort);
    dayBlock[room_id] = classPeriods;
    dayToRoomMap[dateKey] = dayBlock;
  },

  removeFromDayToRoomMap: function(row) {
    var start_date = row.start_date,
        end_date   = row.end_date,
        room_id    = row.room_id;

    var dateKey = formatDayKey(new Date(start_date));
    var dayBlock = dayToRoomMap[dateKey];
    if (dayBlock) {
      var classPeriods = dayBlock[room_id];
      if (classPeriods) {
        var sameInterval = function(v) {
          return v.start_date === start_date && v.end_date === end_date;
        };
        var value = _.find(classPeriods, sameInterval);
        if (value) {
          dayBlock[room_id] = _.difference(classPeriods, [value]);
        }
      }
    }
  },

  removeFromCache: function(v) {
    this.removeFromDayToRoomMap(v);
  },

  addToCache: function(v) {
    this.addToClassPeriodDayMap(v);
  }
});

// TODO: This seems similar to teacher and student, perhaps we can combine the abstraction?
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case SchedulerConstants.CLASS_PERIOD_SAVE:
      action.success([{editData: action.row}]);
      ClassPeriodStore.edit(action.row);
      ClassPeriodStore.save(action.row);
      break;

    case SchedulerConstants.CLASS_PERIOD_NEW:
      ClassPeriodStore.append();
      break;

    case SchedulerConstants.CLASS_PERIOD_LOAD:
      ClassPeriodStore.load(action.data);
      break;

    case SchedulerConstants.CLASS_PERIOD_LOAD_ERROR:
      ClassPeriodStore.loadError();
      break;

    case SchedulerConstants.CLASS_PERIOD_UPDATE_IDS:
      ClassPeriodStore.updateIds(action.data);
      break;

    default:
      // no op
  }
});

module.exports = ClassPeriodStore;