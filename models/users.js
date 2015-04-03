'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    firstname: DataTypes.STRING(20),
    lastname: DataTypes.STRING(20),
    password: DataTypes.STRING, //replace with encryption
    photo: DataTypes.STRING,
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    active: DataTypes.BOOLEAN
  });

  User.associate = function(db) {
    User.hasOne(db.Teacher, {
      foreignKey: "id"
    });
  };

  return User;
};