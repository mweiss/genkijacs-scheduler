'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Class_Registration', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    class_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    creation_date: DataTypes.DATE,
    deletion_date: DataTypes.DATE
  });
};