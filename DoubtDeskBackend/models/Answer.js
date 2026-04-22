const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Answer = sequelize.define('Answer', {
    answerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    answerText: {
      type: DataTypes.TEXT
    },
    answerAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'questions',
        key: 'questionId'
      }
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'teacherId'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'studentId'
      }
    }
  }, {
    tableName: 'answers'
  });

  return Answer;
};
