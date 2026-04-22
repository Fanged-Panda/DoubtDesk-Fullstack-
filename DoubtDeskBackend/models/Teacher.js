const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Teacher = sequelize.define('Teacher', {
    teacherId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    institute: {
      type: DataTypes.STRING
    },
    qualification: {
      type: DataTypes.STRING
    },
    solvedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    joinDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'teachers'
  });

  return Teacher;
};
