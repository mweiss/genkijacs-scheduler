'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: DataTypes.STRING,
    password: DataTypes.STRING, //replace with encryption
    photo: DataTypes.STRING,
    firstname: DataTypes.INTEGER,
    lastname: DataTypes.INTEGER,
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    active: DataTypes.BOOLEAN
  });

  User.associate = function(db) {
    User.belongsTo(db.Teacher, {
      foreignKey: "id",
      as: "teacher"
    });

    User.belongsTo(db.Student, {
      foreignKey: "id",
      as: "student"
    });
  };


  return User;
};