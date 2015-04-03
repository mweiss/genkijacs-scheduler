'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    firstname: DataTypes.STRING(20),
    lastname: DataTypes.STRING(20),
    country: DataTypes.STRING(20), 
    primary_lang: DataTypes.STRING(20),
    jap_level: DataTypes.STRING(20),
    note: DataTypes.STRING(20)
  });
};