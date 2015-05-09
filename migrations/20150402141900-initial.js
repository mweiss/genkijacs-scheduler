'use strict';

module.exports = {
  up: function(migration, DataTypes, done) {

    var options = {charset: 'utf8'};

    migration.createTable('teachers', {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      color: DataTypes.INTEGER
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
      jap_level: DataTypes.STRING,
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

    done();
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