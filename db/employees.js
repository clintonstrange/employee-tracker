const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.PASSWORD ?? "password",
  database: "dunder_mifflin_db",
});

module.exports = connection;
