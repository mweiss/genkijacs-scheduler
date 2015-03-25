'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.ENUM('student', 'teacher', 'admin')
  });

  User.associate = function(db) {
    User.hasOne(db.Teacher, {
      foreignKey: "id"
    });
  };

  return User;
};