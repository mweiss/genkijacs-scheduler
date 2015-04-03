'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    country: DataTypes.STRING, 
    primary_lang: DataTypes.STRING,
    jap_level: DataTypes.STRING,
    note: DataTypes.STRING
  });
};