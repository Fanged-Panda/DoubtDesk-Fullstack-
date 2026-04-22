const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attachment = sequelize.define('Attachment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING
    },
    questionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'questions',
        key: 'questionId'
      }
    },
    answerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'answers',
        key: 'answerId'
      }
    }
  }, {
    tableName: 'attachments'
  });

  return Attachment;
};
