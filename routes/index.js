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

module.exports = router;
