'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Class', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    type: DataTypes.STRING
  });
};