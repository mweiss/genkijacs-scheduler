'use strict';

var express = require('express');
var db = require('../models/index');
var router = express.Router();
var db = require('../models/index');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* teachers */
router.get("/teachers", function (req, res) {
  
  if (typeof(req.query.user) !== 'undefined') {
    console.log('TODO: get teacher by id');
  } else {
    db.User.all({ include: [{ all: true }]}).then(function (result) {
      res.send(JSON.stringify(result));
    });
  }
  
});

router.post('/teachers', function(req, res) {

  if (typeof(req.query.userid) !== 'undefined') {
    console.log('TODO: implement edit/insert into teachers');
  } else {
    console.log('TODO: id not given ...');
    res.status(200).json(null);
  }

});

/* students */
router.get("/students", function (req, res) {
  
  if (typeof(req.query.user) !== 'undefined') {
    console.log('TODO: get student by id');
  } else {
    db.User.all({ include: [{ all: true }]}).then(function (result) {
      res.send(JSON.stringify(result));
    });
  }
  
});

router.post('/students', function(req, res) {

  if (typeof(req.query.userid) !== 'undefined') {
    console.log('TODO: implement edit/insert into students');
  } else {
    console.log('TODO: id not given ...');
    res.status(200).json(null);
  }

});

/* rooms */
router.get("/rooms", function (req, res) {
  
  if (typeof(req.query.roomid) !== 'undefined') {
    console.log('TODO: get roombyid');
  } else {
    console.log('TODO: get all rooms');
  }
  
});

router.post('/rooms', function(req, res) {

  if (typeof(req.query.roomid) !== 'undefined') {
    console.log('TODO: implement edit/insert into rooms');
  } else {
    console.log('TODO: id not given ...');
  }

});

/* classes */
router.get("/classes", function (req, res) {
  
  if (typeof(req.query.classid) !== 'undefined') {
    console.log('TODO: get class by id');
  } else {
    console.log('TODO: get all classes');
  }
  
});

router.post('/classes', function(req, res) {

  if (typeof(req.query.classid) !== 'undefined') {
    console.log('TODO: implement edit/insert into classes');
  } else {
    console.log('TODO: id not given ...');
  }

});

/* valitation of schedules */
router.post("/validation", function (req, res) {
  
  var list = {}, 
      checked = {}, 
      duplicate = {},
      added = {},
      duplicateIndex = 1;
      
  
  for (var item in req.body.classPeriods) {
    
    list[item] = req.body.classPeriods[item];
    console.log(item);
    
  }
  
  for (var item in list) {
    if (list.hasOwnProperty(item)) {
      
      var obj = list[item];
      
      console.log(obj);
      
      added.class = 0;
      added.room = 0;
      added.teacher = 0;
      
      if (item == 1) {
      
        checked[item] = JSON.parse(JSON.stringify(obj));
      
      } else {
      
        for (var entry in checked) {
          
          if (obj.startDate == checked[entry].startDate && obj.endDate == checked[entry].endDate && obj.classId == checked[entry].classId && added.class == 0) {

            duplicate[duplicateIndex] = JSON.parse(JSON.stringify(obj));
            duplicate[duplicateIndex]["problem"] = "class";
            duplicateIndex++;
            added.class = 1;

          } 
          
          if (obj.startDate == checked[entry].startDate && obj.endDate == checked[entry].endDate && obj.roomId == checked[entry].roomId && added.room == 0) {

            duplicate[duplicateIndex] = JSON.parse(JSON.stringify(obj));
            duplicate[duplicateIndex]["problem"] = "room";
            duplicateIndex++;
            added.room = 1;

          } 
          if (obj.startDate == checked[entry].startDate && obj.endDate == checked[entry].endDate && obj.teacherId == checked[entry].teacherId && added.teacher == 0) {

            duplicate[duplicateIndex] = JSON.parse(JSON.stringify(obj));
            duplicate[duplicateIndex]["problem"] = "teacher";
            duplicateIndex++;
            added.teacher = 1;

          }

          checked[item] = JSON.parse(JSON.stringify(obj));

        }
      }
    }
  }
  
  console.log("list");
  console.log(list);
  console.log("checked");
  console.log(checked);
  console.log("duplicate");
  console.log(duplicate);
  
  if (duplicateIndex == 1) {
    res.send("everything is fine");
  } else {
    res.send(duplicate);
  }

});

module.exports = router;
