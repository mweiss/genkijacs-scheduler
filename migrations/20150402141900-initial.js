'use strict';

function createRooms(migration, done) {
  var rooms = [{
    "name_jp": "１番",
    "name_en": "Room 1",
    "capacity": 7
  },
  {
    "name_jp": "２番",
    "name_en": "Room 2",
    "capacity": 7
  },
  {
    "name_jp": "３番",
    "name_en": "Room 3",
    "capacity": 7
  },
  {
    "name_jp": "４番",
    "name_en": "Room 4",
    "capacity": 7
  },
  {
    "name_jp": "５番",
    "name_en": "Room 5",
    "capacity": 7
  },
  {
    "name_jp": "６番",
    "name_en": "Room 6",
    "capacity": 7
  },
  {
    "name_jp": "７番",
    "name_en": "Room 7",
    "capacity": 7
  },
  {
    "name_jp": "８番",
    "name_en": "Room 8",
    "capacity": 7
  },
  {
    "name_jp": "９番",
    "name_en": "Room 9",
    "capacity": 7
  }];

  var sequelize = migration.sequelize;

  // TODO: This is ugly as hell... I need to just force a syncronous query.
  function recursiveUpdate(i) {
    if (i >= rooms.length) {
      done();
      return;
    }
    var room = rooms[i];
    sequelize.query(
      "INSERT INTO translations (lang, text) values(?, ?)",
      {replacements: ['jp', room.name_jp]}).spread(
      function(val) {
        var insertId = val.insertId;
        sequelize.query(
          "INSERT INTO translations (id, lang, text) values(?, ?, ?)",
          {replacements: [insertId, 'en', room.name_en]}).spread(
          function() {
            sequelize.query(
              "INSERT INTO rooms (capacity, name, creation_date) values(?, ?, sysdate())",
              {replacements: [room.capacity, insertId]}).spread(
              function() {
                recursiveUpdate(i + 1);
              }
            );
          }
        );
      }
    );
  }

  recursiveUpdate(0);
}
module.exports = {
  up: function(migration, DataTypes, done) {

    var options = {charset: 'utf8'};

    migration.createTable('teachers', {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      color: DataTypes.STRING
    }, options);

    migration.createTable('classes', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.INTEGER,
      type: DataTypes.STRING
    }, options);    
  
    migration.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      firstname: DataTypes.INTEGER,
      lastname: DataTypes.INTEGER,
      email: DataTypes.STRING,
      password: DataTypes.STRING, //replace with encryption
      photo: DataTypes.STRING,
      type: DataTypes.ENUM('student', 'teacher', 'admin'),
      active: DataTypes.BOOLEAN
    }, options);
    
    migration.createTable('students', {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      country: DataTypes.STRING, 
      primary_lang: DataTypes.STRING,
      japanese_level: DataTypes.STRING,
      note: DataTypes.STRING,
      birthday: DataTypes.DATE
    }, options);
    
    migration.createTable('class_periods', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true  },
      version: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      class_id: DataTypes.INTEGER,
      room_id: DataTypes.INTEGER,
      teacher_id: DataTypes.INTEGER
    }, options);
    
    migration.createTable('class_registrations', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true  },
      class_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
      creation_date: DataTypes.DATE,
      deletion_date: DataTypes.DATE,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE
    }, options);
    
    migration.createTable('rooms', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      name: DataTypes.INTEGER,
      capacity: DataTypes.INTEGER,
      creation_date: DataTypes.DATE,
      archive_date: DataTypes.DATE
    }, options);

    migration.createTable('translations', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      lang: {type: DataTypes.STRING, primaryKey: true },
      text: DataTypes.STRING
    }, options);

    createRooms(migration, done);
  },

  down: function(migration, DataTypes, done) {
    migration.dropTable('teachers');
    migration.dropTable('classes');
    migration.dropTable('users');
    migration.dropTable('students');
    migration.dropTable('class_periods');
    migration.dropTable('class_registrations');
    migration.dropTable('rooms');
    migration.dropTable('translations');
    done();
  }
};