'use srict';

var express = require('express');
var router = express.Router();
var db = require('../models/index');

/* print student */
router.get("/student", function (req, res) {
  
  if (typeof(req.query.user) !== 'undefined') {
    db.User.findAll({ where: {firstname: req.query.user}}).then(function (result) {
      console.log(result);
      res.render('schedule', { title: 'student schedule', user: result }); 
      });
  } else {
    db.User.findAll({ include: [{ all: true }], where: {type: 'student'}}).then(function (result) {
      console.log(result);
      res.render('schedule', { title: 'student schedule', user: result });
    });
  }
});

/* print teacher */
router.get("/teacher", function (req, res) {

 res.render('schedule', { title: 'teacher schedule', user: req.param("user") });
  
});

/* print class */
router.get("/class", function (req, res) {

  res.render('schedule', { title: 'class schedule', user: req.param("class") });
  
});


/* print all */
router.get("/overview", function (req, res) {
  
  res.render('schedule', { title: 'overview' });
  
});


module.exports = router;