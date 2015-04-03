'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Translation', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    lang: DataTypes.STRING(20),
    text: DataTypes.STRING(20)
  });
};