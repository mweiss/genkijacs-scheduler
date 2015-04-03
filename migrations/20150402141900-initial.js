'use strict';

module.exports = {
  up: function(migration, DataTypes, done) {

    migration.createTable('teachers', {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      firstname: DataTypes.STRING,
      laststname: DataTypes.STRING,
      color: DataTypes.INTEGER
    });

    migration.createTable('classes', {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: DataTypes.STRING,
      type: DataTypes.STRING
    });    
  
    migration.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      password: DataTypes.STRING, //replace with encryption
      photo: DataTypes.STRING,
      type: DataTypes.ENUM('student', 'teacher', 'admin'),
      active: DataTypes.BOOLEAN
    });
    
    migration.createTable('students', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      country: DataTypes.STRING, 
      primary_lang: DataTypes.STRING,
      jap_level: DataTypes.STRING,
      note: DataTypes.STRING
    });
    
    migration.createTable('class_periods', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true  },
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      class_id: DataTypes.INTEGER,
      room_id: DataTypes.INTEGER,
      teacher_id: DataTypes.INTEGER,
      kind: DataTypes.STRING
    });
    
    migration.createTable('class_registrations', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true  },
      class_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
      creation_date: DataTypes.DATE,
      drop_date: DataTypes.DATE
    });
    
    migration.createTable('rooms', {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: DataTypes.STRING,
      capacity: DataTypes.INTEGER,
      creation_date: DataTypes.DATE,
      archive_date: DataTypes.DATE
    });

    migration.createTable('translations', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      lang: DataTypes.STRING,
      text: DataTypes.STRING
    });

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