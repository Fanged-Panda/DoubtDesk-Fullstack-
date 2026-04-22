const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
    adminId: {
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
    role: {
      type: DataTypes.STRING,
      defaultValue: 'admin'
    }
  }, {
    tableName: 'admins'
  });

  return Admin;
};
