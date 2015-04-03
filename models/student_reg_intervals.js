'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Student_reg_intervals', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    student_id: DataTypes.INTEGER,
    creation_date: DataTypes.DATE,
    archive_date: DataTypes.DATE,
    type: DataTypes.STRING(20)
  });
};