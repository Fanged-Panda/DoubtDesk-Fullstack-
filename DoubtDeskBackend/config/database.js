const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../database/doubtdesk.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false
  }
});

module.exports = {
  sequelize,
  Sequelize
};
