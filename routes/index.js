'use strict';

var express = require('express');
var db = require('../models/index');
var router = express.Router();
var PromiseHelpers = require('../helpers/promise-helpers');
var _ = require("underscore");

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

/**
 * Helper method to find the message value from the object.
 */
function fetchMessageFromObject(column, lang, obj) {
  var key = column + "_" + lang;
  var value = obj[key];
  return value;
}

/**
 * Updates the messages on the entity to the new values specified by obj.  When the updates
 * are complete, callback is invoked.
 */
function updateMessages(entity, columns, obj, callback) {

  function recursiveUpdateMessages(i) {
    if (i < columns.length) {
      var column = columns[i];
      var value = entity[column];
      db.Translation.findAll({where: {
        id: value
      }}).then(function(values) {
        var promises = [];
        values.each(function(v) {
          var message = fetchMessageFromObject(column, v.lang, obj);
          if (message !== undefined) {
            promises.push(db.Translation.updateAttributes({
              text: message
            }));
          }
        });
        PromiseHelpers.chainPromises(promises, function(v) {
          recursiveUpdateMessages(i + 1);
        })
      });
    }
    else {
      callback();
    }
  }

  rescursiveUpdateMessages(0);
}

/**
 * Creates new messages for a new object with the given columns.  When creation
 * is complete, callback is called with an object mapping the column name to the
 * message id.  This method currently only looks for japanese and english messages.
 */
function createMessages(columns, obj, callback) {
  var messageIds = {};

  function recursiveCreateMessages(i) {
    if (i < columns.length) {
     var column = columns[i];
     db.Translation.create({lang: "en", text: fetchMessageFromObject(column, "en", obj)}).then(function(enMessage) {
       console.log(enMessage);
       var jpMsg = {id: enMessage.id, lang: "jp", text: fetchMessageFromObject(column, "jp", obj)};
       messageIds[column] = enMessage.id;
       db.Translation.create(jpMsg).then(function(jpMessage) {
         recursiveCreateMessages(i+1);
       });
     });
    }
    else {
      callback(messageIds);
    }
  }

  recursiveCreateMessages(0);
}


/**
 * This object represents an object that can save entities.  It should be extended with the whitelisted
 * entity attributes, message attributes, and the model that we want to update.
 */
var SaveEntities = {
  entityAttributes: [],
  entityMessageAttributes: [],
  dateAttributes: [],
  model: null,

  /**
   * The method used to hand the express route.
   */
  handleRequest: function(req, res) {
    var entities = req.body || [];

    this.saveEntities(entities, function(response) {
      res.send(response);
    });
  },

  /**
   * Callback after the main entity has been updated.
   */
  afterUpdate: function(entity, callback) {
    callback(entity);
  },

  /**
   * Callback after the main entity has been updated.
   */
  afterCreate: function(entity, callback) {
    callback(entity);
  },

  /**
   * Creates the entity represented by obj and calls callback once everything
   * is finished.
   */
  createEntity: function(obj, callback) {
    var entityAttributes = this.entityAttributes;
    var entityMessageAttributes = this.entityMessageAttributes;
    var model = this.model;
    var self = this;

    createMessages(entityMessageAttributes, obj, function(savedMessages) {
      var entity = _.pick(obj, entityAttributes);
      entity = _.extend(entity, savedMessages);
      model.create(entity).then(function(saved) {
        self.afterCreate(obj, saved, callback);
      });
    });
  },

  /**
   * Updates the entity represented by obj and calls callback once everything
   * is finished.
   */
  updateEntity: function(obj, callback) {
    var entityAttributes = this.entityAttributes;
    var entityMessageAttributes = this.entityMessageAttributes;
    var model = this.model;
    var self = this;

    model.find(obj.id).then(function(val) {
      var attributesToUpdate = _.pick(obj, entityAttributes);
      val.updateAttributes(attributesToUpdate).then(function() {
        updateMessages(val, entityMessageAttributes, obj, function() {
          self.afterUpdate(obj, val, callback);
        });
      });
    });
  },

  /**
   * Helper method which converts json date strings back to json dates.
   */
  convertDates: function(entity) {
    this.dateAttributes.each(function(attribute) {
      var v = entity[attribute];
      if (v && typeof v === "string") {
        entity[attribute] = new Date(v);
      }
    })
  },

  /**
   * Saves all the entities represented by entities and calls callback once
   * all the entities have been saved.
   */
  saveEntities: function(entities, callback) {
    var response = [];

    function recursiveSave(i) {
      if (i >= entities.length) {
        callback(response);
        return;
      }

      var v = this.convertDates(entities[i]);
      if (v.id) {
        this.updateEntity(v, _.bind(function() {
          recursiveSave.call(this, i + 1);
        }, this));
      }
      else {
        this.createEntity(v, _.bind(function(value) {
          response.push({
            idx: i,
            id: value.id
          });
          recursiveSave.call(this, i + 1);
        }, this));
      }
    }

    recursiveSave.call(this, 0);
  }

};

/**
 * Helper method to create the save request.
 */
function createSaveRequest(obj) {
  var extendedObj = _.extend({}, SaveEntities, obj);
  return _.bind(SaveEntities.handleRequest, extendedObj);
}

/**
 * SaveEntities extension for user entities.  User entities have sub entities that need
 * to be updated once the main user entity has been updated.
 */
var SaveUserEntities = _.extend({}, SaveEntities, {
  entityAttributes: ["email", "type"],
  entityMessageAttributes: ["firstname", "lastname"],
  model: db.User,

  subEntityAttributes: [],
  subModel: null,
  type: null,

  /**
   * A modified express route method for saving entities.
   */
  handleUserRequest: function(req, res) {
    var entities = _.map(req.body || [], function(v) {
      return _.extend({}, v, {type: this.type});
    }, this);

    this.saveEntities(entities, function(response) {
      res.send(response);
    });
  },

  /**
   * After the main entity updates, this method updates the sub entity.
   */
  afterUpdate: function(obj, entity, callback) {
    var subEntityAttributes = this.subEntityAttributes;
    var subModel = this.subModel;

    // update the sub model
    subModel.find(obj.id).then(function(val) {
      var attributesToUpdate = _.pick(obj, subEntityAttributes);
      val.updateAttributes(attributesToUpdate).then(function() {
        callback(entity);
      });
    });
  },

  /**
   * After the main entity create, this method creates the sub entity.
   */
  afterCreate: function(obj, entity, callback) {
    var subEntityAttributes = this.subEntityAttributes;
    var subModel = this.subModel;

    var subEntity = _.pick(obj, subEntityAttributes);
    subEntity.id = entity.id;
    subModel.create(subEntity).then(function() {
      callback(entity);
    });
  }
});

/**
 * Helper method to create a save user request.
 */
function createSaveUserRequest(obj) {
  var extendedObj = _.extend({}, SaveUserEntities, obj);
  return _.bind(SaveUserEntities.handleUserRequest, extendedObj); 
}

/* ================================================================================
 * Teachers (Routes and helpers)
 * ================================================================================
 */
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

router.post("/teachers", createSaveUserRequest({
  subEntityAttributes: ["color"],
  subModel: db.Student,
  type: "teacher"
}));

/* ================================================================================
 * Students (Routes and helpers)
 * ================================================================================
 */
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

router.post("/students", createSaveUserRequest({
  subEntityAttributes: ["country", "primary_lang", "jap_level", "note", "birthday"],
  dateAttributes: ["birthday"],
  subModel: db.Student,
  type: "student"
}));

/* ================================================================================
 * Rooms (Routes and helpers)
 * ================================================================================
 */
router.get('/rooms', function(req, res) {
  db.Room.all({ include: [{ all: true}]}).then(function (result) {
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

router.post("/rooms", createSaveRequest({
  entityAttributes: ["capacity"],
  entityMessageAttributes: ["name"],
  model: db.Room
}));

/* ================================================================================
 * Classes (Routes and helpers)
 * ================================================================================
 */
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

router.post("/classes", createSaveRequest({
  entityAttributes: ["type"],
  entityMessageAttributes: ["name"],
  model: db.Class
}));

/* ================================================================================
 * Class registrations (Routes and helpers)
 * ================================================================================
 */
router.get('/class-registrations', function(req, res) {
  db.Class_Registration.findAll({ where: ['deletion_date IS NULL'] }).then(function (result) {
    res.send(JSON.stringify(result));
  });
});

router.post("/class-registrations", createSaveRequest({
  entityAttributes: ["class_id", "student_id", "start_date", "end_date", "creation_date"],
  dateAttributes: ["start_date", "end_date"],
  model: db.Class_Registration
}));

/* ================================================================================
 * Class periods (Routes and helpers)
 * ================================================================================
 */
router.get('/class-periods', function(req, res) {
  // TODO: use a smarter query than this to find class registrations
  db.Class_Period.all().then(function (result) {
    res.send(JSON.stringify(result));
  });
});

router.post("/class-periods", function(req, res) {

  var entities = req.body || [];

  var results = [];

  function updateClassPeriodsRecursive(i) {

    if (i >= entities.length) {
      res.send(results);
    }

    var v = entities[i];

    v.start_date = new Date(v.start_date);
    v.end_date = new Date(v.end_date);

    var whereClause = {
      version: null,
      start_date: v.start_date,
      end_date: v.end_date,
      room_id: v.room_id
    };

    db.Class_Period.find({where: whereClause}).then(function(result) {
      if (result) {
        var updateAttrs = _.pick(v, ["class_id", "teacher_id"]);
        result.updateAttributes(updateAttrs).then(function() {
          updateClassPeriodsRecursive(i + 1);
        });
      }
      else {
        var newEntity = _.pick(v, ["class_id", "teacher_id", "start_date", "end_date", "room_id"])
        db.Class_Period.create(newEntity).then(function(v) {
          results.push({idx: i, id: v.id});
          updateClassPeriodsRecursive(i + 1);
        });
      }
    });
  }
});

module.exports = router;
