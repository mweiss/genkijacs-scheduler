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
  var ad = new Date(a.startDate);
  var bd = new Date(b.startDate);

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
      "startDate": "",
      "endDate": "",
      "classId": "",
      "roomId": "",
      "teacherId": ""
    };
  },

  findByDay: function(date) {
    var dateKey = formatDayKey(date);
    return dayToRoomMap[dateKey] || {};
  },

  addToClassPeriodDayMap: function(row) {
    var startDate = row.startDate,
        endDate   = row.endDate,
        roomId    = row.roomId;

    var dateKey = formatDayKey(new Date(startDate));
    var dayBlock = dayToRoomMap[dateKey] || {};
    var rooms = dayBlock[roomId] || [];

    // For now, we"ll assume that the class periods will always be the same... so we"ll only
    // need to remove one at most

    var sameInterval = function(v) {
      return v.startDate === startDate && v.endDate === endDate;
    };

    var oldRoom = _.find(rooms, sameInterval);
    if (oldRoom) {
      this.del(oldRoom);
    }

    rooms.push(row);
    rooms.sort(startDateSort);
    dayBlock.rooms = rooms;
    dayToRoomMap[dateKey] = dayBlock;
  },

  removeFromDayToRoomMap: function(row) {
    var startDate = row.startDate,
        endDate   = row.endDate,
        roomId    = row.roomId;

    var dateKey = formatDayKey(new Date(startDate));
    var dayBlock = dayToRoomMap[dateKey];
    if (dayBlock) {
      var rooms = dayBlock[roomId];
      if (rooms) {
        var sameInterval = function(v) {
          return v.startDate === startDate && v.endDate === endDate;
        };
        var value = _.find(rooms, sameInterval);
        if (value) {
          dayBlock[roomId] = _.difference(rooms, [value]);
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
      ClassPeriodStore.save(action.row);
      break;

    case SchedulerConstants.CLASS_PERIOD_NEW:
      ClassPeriodStore.append();
      break;

    case SchedulerConstants.CLASS_PERIOD_EDIT:
      ClassPeriodStore.edit(action.row);
      break;
      
    default:
      // no op
  }
});

ClassPeriodStore.setAll([{
  "start_date": "",
  "end_date": "",
  "class_id": "",
  "room_id": "",
  "teacher_id": ""
}]);

module.exports = ClassPeriodStore;