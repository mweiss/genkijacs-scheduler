'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');
var ActionUtils = require('./ActionUtils');

// TODO: Room, student and teacher actions are very very similar... we can probably combine them
var RoomActions = {

  edit: function(room) {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.ROOM_EDIT,
      row: room
    });
  },

  save: function(room) {
    var updateMethod = ActionUtils.createEditCallback('/rooms', SchedulerConstants.ROOM_UPDATE_IDS);
    updateMethod([room]);

    AppDispatcher.dispatch({
      actionType: SchedulerConstants.ROOM_SAVE,
      row: room
    });
  },

  new: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.ROOM_NEW
    });
  }

};

module.exports = RoomActions;