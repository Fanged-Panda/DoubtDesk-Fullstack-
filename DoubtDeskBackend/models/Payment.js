const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.STRING
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'studentId'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'courseId'
      }
    }
  }, {
    tableName: 'payments'
  });

  return Payment;
};
