'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    firstname: DataTypes.STRING(20),
    laststname: DataTypes.STRING(20),
    color: DataTypes.INTEGER
  });
};