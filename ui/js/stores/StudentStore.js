"use strict";

var assign = require("object-assign");

var AppDispatcher = require("../dispatcher/AppDispatcher");
var SchedulerConstants = require("../constants/SchedulerConstants");
var FluxStore = require("./FluxStore");

var StudentStore = assign(FluxStore.createStore(), {
  initEntity: function(ui_id) {
    return {
      "name_jp": "",
      "name_en": "",
      "enrollment_intervals": [],
      "primary_language": "",
      "home_country": "",
      "japanese_proficiency": "",
      "notes": "",
      "birthday": ""
    };
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case SchedulerConstants.STUDENT_SAVE:
      StudentStore.save(action.row);
      break;

    case SchedulerConstants.STUDENT_NEW:
      StudentStore.append();
      break;

    default:
      // no op
  }
});

StudentStore.setAll([{
  "name_jp": "マイケル　ワイス",
  "name_en": "Michael Weiss",
  "enrollment_intervals": [{start: "2015-01-03T00:00:00.000Z", end: "2015-05-30T00:00:00.000Z"}],
  "primary_language": "英語",
  "home_country": "米国",
  "japanese_proficiency": "中級レベル",
  "notes": "かっこいい！",
  "birthday": "1986-03-21T00:00:00.000Z"
}, {
  "name_jp": "サシャ　ドウシェン",
  "name_en": "Sascha Duschen",
  "enrollment_intervals": [{start: "2015-01-10T00:00:00.000Z", end: "2015-06-12T00:00:00.000Z"}],
  "primary_language": "ドイツ語",
  "home_country": "ドイツ",
  "japanese_proficiency": "中級レベル",
  "notes": "お金持ち",
  "birthday": "1986-03-14T00:00:00.000Z"  
}]);

module.exports = StudentStore;