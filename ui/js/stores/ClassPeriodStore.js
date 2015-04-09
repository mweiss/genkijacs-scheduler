"use strict";

var assign = require("object-assign");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var SchedulerConstants = require("../constants/SchedulerConstants");
var FluxStore = require("./FluxStore");

var ClassPeriodStore = assign(FluxStore.createStore(), {
  initEntity: function() {
    return {
      "name_jp": "",
      "name_en": "",
      "type": "normal" // todo: enumerate the class types
    };
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
}]);

module.exports = ClassPeriodStore;