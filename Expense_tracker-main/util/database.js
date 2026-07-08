const mysql = require('mysql2');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD, {
  host: process.env.RDS_ENDPOINT,
  port: process.env.DB_PORT,
  dialect:process.env.DIALECT,
});

module.exports=sequelize;