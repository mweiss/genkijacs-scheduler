'use strict';

module.exports = function(sequelize, DataTypes) {
  var ClassPeriod = sequelize.define('Class_Period', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    version: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  });

  ClassPeriod.associate = function(db) {
    ClassPeriod.belongsTo(db.Class, { 
      foreignKey: "class_id" 
    });
    ClassPeriod.belongsTo(db.Room, { 
      foreignKey: "room_id" 
    });
    ClassPeriod.belongsTo(db.Teacher, { 
      foreignKey: "teacher_id" 
    });
  };

  return ClassPeriod;
};