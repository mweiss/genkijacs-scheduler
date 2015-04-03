'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    firstname: DataTypes.STRING,
    laststname: DataTypes.STRING,
    color: DataTypes.INTEGER
  });
};