'use srict';

var express = require('express');
var router = express.Router();
var db = require('../models/index');
var _ = require("underscore");

function fetchUserNames(userId, lang, callback) {
   var query = "SELECT u.id AS id, t1.text AS firstname, t2.text AS lastname\n" +
               "FROM users u, translations t1, translations t2\n" +
               "WHERE u.id = ?\n" +
               "AND t1.id = u.firstname\n" +
               "AND t1.lang = ?\n" +
               "AND t2.id = u.lastname\n" +
               "AND t2.lang = ?\n";

  db.sequelize.query(query,
    {replacements: [userId, lang, lang], type: db.sequelize.QueryTypes.SELECT }
  ).then(function(names) {
    callback(names[0]);
  });
}

function fetchClassPeriods(userId, lang, startDate, endDate, callback) {
  var query = "SELECT cp.start_date AS start_date,\n" +
              "       cp.end_date AS end_date,\n" +
              "       t1.text AS class,\n" +
              "       t2.text AS teacher,\n" +
              "       cp.room_id AS room_id\n" +
              "FROM class_registrations cr,\n" +
              "     classes cl,\n" +
              "     users u,\n" +
              "     class_periods cp,\n" +
              "     translations t1,\n" +
              "     translations t2\n" +
              "WHERE cr.student_id = ?\n" +
              "AND   cr.start_date <= ?\n" +
              "AND   cr.end_date >= ?\n" +
              "AND   cr.deletion_date is null\n" +
              "AND   cp.class_id = cr.class_id\n" +
              "AND   cp.start_date >= ?\n" +
              "AND   cp.end_date <= ?\n" +
              "AND   cl.id = cr.class_id\n" +
              "AND   t1.id = cl.name\n" +
              "AND   t1.lang = ?\n" +
              "AND   u.id = cp.teacher_id\n" +
              "AND   t2.id = u.lastname\n" +
              "AND   t2.lang = ?\n";

  db.sequelize.query(query,
    { 
      replacements: [userId, startDate, endDate, startDate, endDate, lang, lang],
      type: db.sequelize.QueryTypes.SELECT
    }
  ).then(function(class_periods) {
    callback(class_periods);
  });
}

function fetchRoomNameCallback(lang, classPeriodsCallback, callbackReady) {

  var query = "SELECT r.id AS id, t1.text AS name\n" +
              "FROM translations t1,\n" +
              "     rooms r\n" +
              "WHERE r.name = t1.id\n" +
              "AND   t1.lang = ?\n";

  db.sequelize.query(query, {
    replacements: [lang], type: db.sequelize.QueryTypes.SELECT
  }).then(function(rooms) {
    var roomMap = {};
    rooms.forEach(function(room) {
      roomMap[room.id] = room.name;
    });

    function fixRoomCallback(class_periods) {
      class_periods.forEach(function(class_period) {
        if (class_period.room_id < 0) {
          class_period.room = 'Out ' + (class_period.room_id * -1);
        }
        else {
          class_period.room = roomMap[class_period.room_id] || "";
        }
      });
      classPeriodsCallback(class_periods);
    }
    callbackReady(fixRoomCallback);
  });
}

function findStudentsWithClassRegistrations(startDate, endDate, callback) {
  var query = "SELECT DISTINCT cr.student_id as id\n" +
              "FROM class_registrations cr\n" +
              "WHERE cr.deletion_date is null\n" +
              "AND cr.start_date <= ?\n" +
              "AND cr.end_date >= ?\n";

  db.sequelize.query(query, {
    replacements: [startDate, endDate], type: db.sequelize.QueryTypes.SELECT
  }).then(function(students) {
    callback(students.map(function(student) {
      return student.id;
    }));
  })
}

function fetchTemplateData(userId, lang, startDate, endDate, callback) {

  function classPeriodCallback(classPeriods) {
    fetchUserNames(userId, lang, function(name) {
      var templateData = _.clone(name);
      templateData.classPeriods = classPeriods;
      callback(templateData);
    });
  }

  fetchRoomNameCallback(lang, classPeriodCallback, function(fixRoomCallback) {
    fetchClassPeriods(userId, lang, startDate, endDate, fixRoomCallback);
  });
}

/**
 * Request parameters:
 *   startDate, (optional) userId
 */
router.get("/student", function (req, res) {
  var startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  var userId    = req.query.userId ? +req.query.userId : null;

  if (!startDate || isNaN(startDate.getTime())) {
    res.sendStatus(400);
    return;
  }

  var endDate = new Date(startDate);
  var lang = 'en';

  endDate.setDate(endDate.getDate() + 5);
  if (!userId) {
    findStudentsWithClassRegistrations(startDate, endDate, function(users) {
      var i = 0, results = [];
      function recursiveFindStudents() {
        if (i >= users.length) {
          res.render('multiple-schedules', {
            results: results
          });
        }
        else {
          fetchTemplateData(users[i], lang, startDate, endDate, function(td) {
            results.push(td);
            i += 1;
            recursiveFindStudents();
          });
        }
      }
      recursiveFindStudents();
    });
  }
  else {
    fetchTemplateData(userId, lang, startDate, endDate, function(templateData) {
      res.render('schedule', {
        data: templateData
      });
    });
  }
});

/* print teacher */
router.get("/teacher", function (req, res) {
 // This probably very similar to students, in that the only differences
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