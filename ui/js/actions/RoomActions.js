'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SchedulerConstants = require('../constants/SchedulerConstants');
var WebAPIUtils = require('../http/WebAPIUtils');

// TODO: Room, student and teacher actions are very very similar... we can probably combine them
var RoomActions = {

  edit: function(cl) {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.ROOM_EDIT,
      row: cl
    });
  },

  save: function(cl) {
    /*
    WebAPIUtils.makeRequest({
      url: '/rooms',
      method: 'post',
      data: cl,
      success: function(resp) {
        console.log('SA.update.success', resp);
      }
    });
    */

    AppDispatcher.dispatch({
      actionType: SchedulerConstants.ROOM_SAVE,
      row: cl
    });
  },

  new: function() {
    AppDispatcher.dispatch({
      actionType: SchedulerConstants.ROOM_NEW
    });
  }

};

module.exports = RoomActions;