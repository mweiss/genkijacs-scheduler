'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
<<<<<<< HEAD
    firstname: DataTypes.STRING(20),
    laststname: DataTypes.STRING(20),
=======
>>>>>>> 8ee83c7aebec074b602816c57d61930d1f4ef2f0
    color: DataTypes.INTEGER
  });
};