'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Class_registration', {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      class_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
      creation_date: DataTypes.DATE,
      drop_date: DataTypes.DATE
    });
};