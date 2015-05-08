'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    color: DataTypes.INTEGER
  });
};