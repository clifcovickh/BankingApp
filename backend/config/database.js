const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  logging: false,
  timezone: '+07:00',
  dialectOptions: {
    useUTC: false,
    dateStrings: true,
    typeCast: true,
  },
});

module.exports = sequelize;
