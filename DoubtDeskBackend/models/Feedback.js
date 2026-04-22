const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Feedback = sequelize.define('Feedback', {
    feedbackId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    comment: {
      type: DataTypes.TEXT
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'studentId'
      }
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'teacherId'
      }
    }
  }, {
    tableName: 'feedbacks'
  });

  return Feedback;
};
