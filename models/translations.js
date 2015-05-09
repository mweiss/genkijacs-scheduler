'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Translation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lang: {type: DataTypes.STRING, primaryKey: true },
    text: DataTypes.STRING
  });
};