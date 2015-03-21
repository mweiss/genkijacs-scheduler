'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.ENUM('student', 'teacher', 'admin')
  });
};