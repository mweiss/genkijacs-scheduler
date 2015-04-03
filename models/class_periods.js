'use strict';

module.exports = function(sequelize, DataTypes) {
  var Class_periods = sequelize.define('Class_period', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    class_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    teacher_id: DataTypes.INTEGER,
    kind: DataTypes.STRING(20)
  });

  Class_periods.associate = function(db) {
    Class_periods.hasOne(db.Class, { 
      foreignKey: "id" 
    });
    Class_periods.hasOne(db.Room, { 
      foreignKey: "id" 
    });
    Class_periods.hasOne(db.Teacher, { 
      foreignKey: "id" 
    });
  };

  return Class_periods;
};