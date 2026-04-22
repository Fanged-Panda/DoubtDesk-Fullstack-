const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Question = sequelize.define('Question', {
    questionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('pending', 'solved', 'satisfied', 'follow-up-pending', 'follow-up-solved'),
      defaultValue: 'pending'
    },
    postAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    answeredAt: {
      type: DataTypes.DATE
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'studentId'
      }
    },
    subjectId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'subjects',
        key: 'subjectId'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'courses',
        key: 'courseId'
      }
    },
    originalQuestionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'questions',
        key: 'questionId'
      }
    }
  }, {
    tableName: 'questions'
  });

  return Question;
};
