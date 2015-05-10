"use strict";

var assign = require("object-assign");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var SchedulerConstants = require("../constants/SchedulerConstants");
var FluxStore = require("./FluxStore");

var RoomStore = assign(FluxStore.createStore(), {
  initEntity: function() {
    return {
      "name_jp": "",
      "name_en": "",
      "capacity": 7 // todo: enumerate the class types
    };
  }
});

// TODO: This seems similar to teacher and student, perhaps we can combine the abstraction?
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case SchedulerConstants.ROOM_SAVE:
      RoomStore.save(action.row);
      break;

    case SchedulerConstants.ROOM_NEW:
      RoomStore.append();
      break;

    case SchedulerConstants.ROOM_EDIT:
      RoomStore.edit(action.row);
      break;

    case SchedulerConstants.ROOM_LOAD:
      RoomStore.load(action.data);
      break;

    case SchedulerConstants.ROOM_LOAD_ERROR:
      RoomStore.loadError();
      break;

    case SchedulerConstants.ROOM_UPDATE_IDS:
      RoomStore.updateIds(action.data);
      break;
      
    default:
      // no op
  }
});

module.exports = RoomStore;