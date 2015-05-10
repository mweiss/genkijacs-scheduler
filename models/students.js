'use strict';

module.exports = function(sequelize, DataTypes) {
  var Student = sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    country: DataTypes.STRING, 
    primary_lang: DataTypes.STRING,
    japanese_level: DataTypes.STRING,
    note: DataTypes.STRING,
    birthday: DataTypes.DATE
  });

  return Student;
};