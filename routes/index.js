'use strict';

var express = require('express');
var db = require('../models/index');
var router = express.Router();
var PromiseHelpers = require('../helpers/promise-helpers');

/**
 *  Searches the array of translation texts (names) and returns the text of the translation that
 *  matches the given language (lang).  Returns null if no translation could be found.
 */
function getTranslationText(names, lang) {
  for (var i = 0; names && i < names.length; i += 1) {
    var name = names[i];
    if (name.lang === lang) {
      return name.text;
    }
  }
  return null;
}

/**
 *  Fetches the translation texts specified by the columns argument (an array of strings).
 *  Once all the translation texts have been fetched, the next function is called with the translations as arguments
 *  Each entry in each translation array matches the same index of the entity in the entities array.
 *  The number of arguments passed into the next callback is equal to the length of the columns attribute, e.g. there
 *  is one argument for each column we're fetching translations for.
 *
 *  @param entities - An array of objects representing database entities
 *  @param columns  - An array of strings representing columns on the entities that are translations
 *  @param next     - A callback that is invoked once all the translation texts have been fetched.
 */

function findTranslationTexts(entities, columns, next) {
  var i = 0, results = [];

  function doNextThing(res) {
    if (i !== 0) {
      results.push(res);
    }

    if (i < columns.length) {

      var translationPromises = entities.map(function(v) {
        return db.Translation.findAll({ where: {
          id: v[columns[i]]
        }});
      });

      i += 1;

      PromiseHelpers.chainPromises(translationPromises, doNextThing);
    }
    else {
      next.apply(this, results);
    }
  }

  doNextThing();
}

/**
 * Helper method to fetch users from the database.  This is used when fetching teachers and students,
 * since the code to fetch the two entities are quite similar.
 */
function fetchUsers(users, updateCallback, resultCallback) {
  findTranslationTexts(users, ["firstname", "lastname"], function(firstnames, lastnames) {
    var usrs = users.map(function(v, i) {
      var usr = users[i];
      var firstname = firstnames[i];
      var lastname = lastnames[i];
      var obj = {
        id: usr.id,
        firstname_en: getTranslationText(firstname, 'en'),
        firstname_jp: getTranslationText(firstname, 'jp'),
        lastname_en: getTranslationText(lastname, 'en'),
        lastname_jp: getTranslationText(lastname, 'jp')
      }
      updateCallback(obj, usr);
      return obj;
    });
    resultCallback.call(this, usrs);
  });
}

/* teachers */
router.get("/teachers", function (req, res) {
  var findAllParams = { 
    where: {
      type: 'teacher'
    },
    include: [{ all: true}]};
  
  db.User.findAll(findAllParams).then(function (users) {
    var updateWithTeacherInfo = function(obj, entity) {
      var teacher = entity.teacher;
      obj.color = teacher.color;
    };
    fetchUsers(users, updateWithTeacherInfo, function(results) {
      res.send(JSON.stringify(results));
    });
  });  
});

/* students */
router.get("/students", function (req, res) {
  var findAllParams = { 
    where: {
      type: 'student'
    },
    include: [{ all: true}]};

  db.User.findAll(findAllParams).then(function (users) {
    var updateWithTeacherInfo = function(obj, entity) {
      var student = entity.student;
      obj.country = student.country;
      obj.primary_lang = student.primary_lang;
      obj.jap_level = student.jap_level;
      obj.note = student.note;
    };
    fetchUsers(users, updateWithTeacherInfo, function(results) {
      res.send(JSON.stringify(results));
    });
  });
});

/* rooms */
router.get('/rooms', function(req, res) {
  db.Rooms.all({ include: [{ all: true}]}).then(function (result) {
    findTranslationTexts(result, ["name"], function (names) {
      var rooms = result.map(function(v, i) {
        var rm = result[i];
        var name = names[i] || [];
        return {
          id: rm.id,
          capacity: rm.capacity,
          name_en: getTranslationText(name, 'en'),
          name_jp: getTranslationText(name, 'jp')
        }
      });
      res.send(JSON.stringify(rooms));
    });
  });
});

/* classes */
router.get("/classes", function (req, res) {
  db.Class.all({ include: [{ all: true }]}).then(function (result) {
    findTranslationTexts(result, ["name"], function (names) {
      var cls = result.map(function(v, i) {
        var cl = result[i];
        var name = names[i] || [];
        return {
          id: cl.id,
          type: cl.type,
          name_en: getTranslationText(name, 'en'),
          name_jp: getTranslationText(name, 'jp')
        }
      });
      res.send(JSON.stringify(cls));
    });
  });
});

/* Class registrations */
router.get('/class-registrations', function(req, res) {
  db.Class_Registration.findAll({ where: ['deletion_date IS NULL'] }).then(function (result) {
    res.send(JSON.stringify(result));
  });
});

/*Class periods*/
router.get('/class-periods', function(req, res) {
  // TODO: use a smarter query than this to find class registrations
  db.Class_Period.all().then(function (result) {
    res.send(JSON.stringify(result));
  });
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
