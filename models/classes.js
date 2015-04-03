'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Class', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING(20),
    type: DataTypes.STRING(20)
  });
};