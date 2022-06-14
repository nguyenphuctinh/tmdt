import mysql from "mysql";

var db_config = {
  host: "localhost",
  user: "root",
  port: "3306",
  password: "abcd",
  database: "nodejs",
};

var connection = mysql.createPool({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
});

export default connection;
