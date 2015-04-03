'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING(20),
    capacity: DataTypes.INTEGER,
    creation_date: DataTypes.DATE,
    archive_date: DataTypes.DATE
  });
};