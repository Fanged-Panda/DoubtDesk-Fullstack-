const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subject = sequelize.define('Subject', {
    subjectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subjectName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'subjects'
  });

  return Subject;
};
