'use srict';

var express = require('express');
var router = express.Router();
var db = require('../models/index');
var _ = require("underscore");

/**
 * Fetches the user's first and last names in the specified language.  When finished,
 * this method invokes callback with the fetched names.
 */
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

var ClassPeriodColumns = "SELECT cp.start_date AS start_date,\n" +
                         "       cp.end_date AS end_date,\n" +
                         "       t1.text AS class,\n" +
                         "       t2.text AS teacher,\n" +
                         "       cp.room_id AS room_id\n";

/**
 * Fetch the class periods from startDate to endDate that the teacher is registered for.
 * The text provided will be in the language specified.
 */
function fetchTeacherClassPeriods(userId, lang, startDate, endDate, callback) {
  var query = ClassPeriodColumns +
              "FROM classes cl,\n" +
              "     users u,\n" +
              "     class_periods cp,\n" +
              "     translations t1,\n" +
              "     translations t2\n" +
              "WHERE cp.teacher_id = ?\n" +
              "AND   cp.start_date >= ?\n" +
              "AND   cp.end_date <= ?\n" +
              "AND   cl.id = cp.class_id\n" +
              "AND   t1.id = cl.name\n" +
              "AND   t1.lang = ?\n" +
              "AND   u.id = cp.teacher_id\n" +
              "AND   t2.id = u.lastname\n" +
              "AND   t2.lang = ?\n";

  db.sequelize.query(query,
    { 
      replacements: [userId, startDate, endDate, lang, lang],
      type: db.sequelize.QueryTypes.SELECT
    }
  ).then(function(class_periods) {
    callback(class_periods);
  });
}

/**
 * Fetch the class periods from startDate to endDate that the student is registered for.
 * The text provided will be in the language specified.
 */
function fetchStudentClassPeriods(userId, lang, startDate, endDate, callback) {
  var query = ClassPeriodColumns +
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
              "AND   cp.start_date >= cr.start_date\n" +
              "AND   cp.end_date <= cr.end_date + 1\n" +
              "AND   cp.start_date >= ?\n" +
              "AND   cp.end_date <= ?\n" +
              "AND   cl.id = cp.class_id\n" +
              "AND   t1.id = cl.name\n" +
              "AND   t1.lang = ?\n" +
              "AND   u.id = cp.teacher_id\n" +
              "AND   t2.id = u.lastname\n" +
              "AND   t2.lang = ?\n";

  db.sequelize.query(query,
    { 
      replacements: [userId, endDate, startDate, startDate, endDate, lang, lang],
      type: db.sequelize.QueryTypes.SELECT
    }
  ).then(function(class_periods) {
    callback(class_periods);
  });
}

/**
 *  TODO: This method is a hack. Since out rooms don't have room rows, we can't do an 
 *  inner join on rooms in the fetchClassPeriods query.  There's probably a way of doing a smart
 *  left join and naming out rooms in the query... but for now we'll just do a separate query to
 *  figure out the name of the class period rooms.
 *
 *  Returns a callback that will scan through the class periods provided by fetchClassPeriods
 *  and will add the 'room' parameter with the room name in the given language.  
 */
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

/**
 * Finds all the students with class registrations that intersect startDate and endDate.  Calls callback with
 * an array of student ids.
 */
function findStudentsWithClassRegistrations(startDate, endDate, callback) {
  var query = "SELECT DISTINCT cr.student_id as id\n" +
              "FROM class_registrations cr\n" +
              "WHERE cr.deletion_date is null\n" +
              "AND cr.start_date <= ?\n" +
              "AND cr.end_date >= ?\n";

  db.sequelize.query(query, {
    replacements: [endDate, startDate], type: db.sequelize.QueryTypes.SELECT
  }).then(function(students) {
    callback(students.map(function(student) {
      return student.id;
    }));
  })
}

/**
 * Finds all the teachers with class periods between start and end date.
 */
function findTeachersWithClassPeriods(startDate, endDate, callback) {
  var query = "SELECT DISTINCT cp.teacher_id as id\n" +
              "FROM class_periods cp\n" +
              "WHERE cp.start_date >= ?\n" +
              "AND cp.end_date <= ?\n";

  db.sequelize.query(query, {
    replacements: [startDate, endDate], type: db.sequelize.QueryTypes.SELECT
  }).then(function(teachers) {
    callback(teachers.map(function(teacher) {
      return teacher.id;
    }));
  })
}

/**
 * Fetches the template data for the given userId in the given language, with class periods between startDate
 * and endDate.  Here is an example of the template for the user:
 * { 
 *   id: 4, // user id
 *   firstname: 'Sascha',
 *   lastname: 'Duschén',
 *   classPeriods: [ 
 *     { start_date: Mon May 11 2015 09:30:00 GMT+0900 (JST),
 *       end_date: Mon May 11 2015 10:20:00 GMT+0900 (JST),
 *       class: 'Harajuku',
 *       teacher: 'Miyazaki',
 *       room_id: 1,
 *       rooom: 'Room 1'
 *     }
 *   ]
 * }
 */
function fetchTemplateData(userId, lang, startDate, endDate, fetchClassPeriods, callback) {

  function classPeriodCallback(classPeriods) {
    fetchUserNames(userId, lang, function(name) {
      var templateData = _.clone(name);
      templateData.classPeriods = classPeriods;
      console.log(templateData);
      callback(templateData);
    });
  }

  fetchRoomNameCallback(lang, classPeriodCallback, function(fixRoomCallback) {
    fetchClassPeriods(userId, lang, startDate, endDate, fixRoomCallback);
  });
}

/**
 * Prints all the students with active class registrations between startDate and endDate in the provided
 * language.
 */
function printAll(res, userId, startDate, endDate, lang, findAllUsers, fetchClassPeriods) {
  findAllUsers(startDate, endDate, function(users) {
    var i = 0, results = [];
    function recursiveFindStudents() {
      if (i >= users.length) {
        res.render('multiple-schedules', {
          results: results
        });
      }
      else {
        fetchTemplateData(users[i], lang, startDate, endDate, fetchClassPeriods, function(td) {
          results.push(td);
          i += 1;
          recursiveFindStudents();
        });
      }
    }
    recursiveFindStudents();
  });
}


/**
 * Request parameters:
 *   startDate, (optional userId)
 */
function processPrintRequest(lang, fetchClassPeriods, findAllUsers) {
  return function(req, res) {
    var startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    var userId    = req.query.userId ? +req.query.userId : null;

    if (!startDate || isNaN(startDate.getTime())) {
      res.sendStatus(400);
      return;
    }

    var endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5);

    // If there's no userId, then print all the active students
    if (!userId) {
      printAll(res, userId, startDate, endDate, lang, findAllUsers, fetchClassPeriods);
    }
    // If there's a specified user, then just render the template for them
    else {
      fetchTemplateData(userId, lang, startDate, endDate, fetchClassPeriods, function(templateData) {
        res.render('schedule', {
          data: templateData
        });
      });
    }  
  }
}


router.get("/student", processPrintRequest('en', fetchStudentClassPeriods, findStudentsWithClassRegistrations));

router.get("/teacher", processPrintRequest('jp', fetchTeacherClassPeriods, findTeachersWithClassPeriods));

module.exports = router;