const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ResetToken = sequelize.define('ResetToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'userId'
      }
    }
  }, {
    tableName: 'reset_tokens'
  });

  return ResetToken;
};
