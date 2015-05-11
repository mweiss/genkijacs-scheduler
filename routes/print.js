'use srict';

var express = require('express');
var router = express.Router();
var db = require('../models/index');

/* print student */
router.get("/student", function (req, res) {
  
  if (typeof(req.query.user) !== 'undefined') {
    
    var final = [];
    
    // Get Studentinfo
    db.sequelize.query('SELECT `U`.`id`,  `t1`.`text` AS `firstname`, `t2`.`text` AS `lastname` ' +
      'FROM `users` AS `U` ' +
      'INNER JOIN `translations` `t1` ON `U`.`firstname` = `t1`.`id` ' +
      'INNER JOIN `translations` `t2` ON `U`.`lastname` = `t2`.`id` ' +
      'WHERE `U`.`email` = "' + req.query.user + '" LIMIT 1;', { type: db.sequelize.QueryTypes.SELECT }).then(function (result) {
      
      result.forEach(function(r) {
      
        //get class info
        db.sequelize.query('SELECT `CP`.`id`, `CP`.`start_date`,`CP`.`end_date`, `t1`.`text` AS `Class`, `t2`.`text` AS `Room`, `t3`.`text` AS `Teacher`' +
          'FROM `class_periods` AS `CP`' +
          'INNER JOIN `translations` `t1` ON (SELECT `name` FROM `classes` AS `c1` WHERE `c1`.`id` = `CP`.`class_id`) = `t1`.`id`' +
          'INNER JOIN `translations` `t2` ON (SELECT `name` FROM `rooms` AS `r1` WHERE `r1`.`id` = `CP`.`room_id`) = `t2`.`id`' +
          'INNER JOIN `translations` `t3` ON (SELECT `firstname` FROM `users` AS `u1` WHERE `u1`.`id` = `CP`.`teacher_id`) = `t3`.`id`' +
          'WHERE `CP`.`class_id` = (SELECT `CR`.`class_id` FROM `class_registrations` AS `CR` WHERE `CR`.`student_id` = "' + r.id + '" LIMIT 1 );', { type: db.sequelize.QueryTypes.SELECT }).then(function (result2) { 
          
          r.schedule = [];
          result2.forEach(function(c) {
            
            r.schedule.push(c);
            
          });
          
          final.push(r);
          console.log("finalin");
          console.log(r);
          console.log(final);
        });
      });
    });
    
      console.log("final");
      console.log(final);
      res.render('schedule', { title: 'student schedule', user: final });

    
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