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
      
    default:
      // no op
  }
});

RoomStore.setAll([{
  id: 1,
  "name_jp": "１番",
  "name_en": "Room 1",
  "capacity": 7
},
{
  id: 2,
  "name_jp": "２番",
  "name_en": "Room 2",
  "capacity": 7
},
{
  id: 3,
  "name_jp": "３番",
  "name_en": "Room 3",
  "capacity": 7
},
{
  id: 4,
  "name_jp": "４番",
  "name_en": "Room 4",
  "capacity": 7
},
{
  id: 5,
  "name_jp": "５番",
  "name_en": "Room 5",
  "capacity": 7
},
{
  id: 6,
  "name_jp": "６番",
  "name_en": "Room 6",
  "capacity": 7
},
{
  id: 7,
  "name_jp": "７番",
  "name_en": "Room 7",
  "capacity": 7
},
{
  id: 8,
  "name_jp": "８番",
  "name_en": "Room 8",
  "capacity": 7
},
{
  id: 9,
  "name_jp": "９番",
  "name_en": "Room 9",
  "capacity": 7
}
]);

module.exports = RoomStore;