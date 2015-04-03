'use strict';

module.exports = {
  up: function(migration, DataTypes, done) {

    migration.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      type: DataTypes.ENUM('student', 'teacher', 'admin')
    });

    migration.createTable('teachers', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },
      color: DataTypes.INTEGER
    });

    done();
  },

  down: function(migration, DataTypes, done) {
    migration.dropTable('users');
    migration.dropTable('teachers');
    done();
  }
};
