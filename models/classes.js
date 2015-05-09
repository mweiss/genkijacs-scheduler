'use strict';

module.exports = function(sequelize, DataTypes) {
  var Class = sequelize.define('Class', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: DataTypes.STRING,
    name: DataTypes.INTEGER
  });

  return Class;
};