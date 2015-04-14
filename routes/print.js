'use srict';

var express = require('express');
var router = express.Router();

/* print student */
router.get("/student", function (req, res) {
  
  if (req.isAuthenticated()) {
    res.render('schedule', { title: 'student schedule', user: req.param("user") });
  } else {
    res.send('not authorized');
  }
  
});

/* print teacher */
router.get("/teacher", function (req, res) {
  
  if (req.isAuthenticated()) {
    res.render('schedule', { title: 'teacher schedule', user: req.param("user") });
  } else {
    res.send('not authorized'); 
  }
  
});

/* print all */
router.get("/overview", function (req, res) {
  
  if (req.isAuthenticated()) {
    res.render('schedule', { title: 'overview' });
  } else {
    res.send('not authorized'); 
  }
  
});

module.exports = router;