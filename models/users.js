'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
<<<<<<< HEAD
    firstname: DataTypes.STRING(20),
    lastname: DataTypes.STRING(20),
    password: DataTypes.STRING, //replace with encryption
    photo: DataTypes.STRING,
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    active: DataTypes.BOOLEAN
=======
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.ENUM('student', 'teacher', 'admin')
>>>>>>> 8ee83c7aebec074b602816c57d61930d1f4ef2f0
  });

  User.associate = function(db) {
    User.hasOne(db.Teacher, {
      foreignKey: "id"
    });
  };

  return User;
};