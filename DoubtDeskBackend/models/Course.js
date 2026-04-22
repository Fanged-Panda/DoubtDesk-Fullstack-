const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    courseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    category: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  }, {
    tableName: 'courses'
  });

  return Course;
};
