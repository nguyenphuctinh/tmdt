var mysql = require("mysql");

var db_config = {
  host: "us-cdbr-east-05.cleardb.net",
  user: "bcfc9b7ab00c04",
  port: "3306",
  password: "bd6dc0ce",
  database: "heroku_fdea9aba84c6f63",
};

// var db_config = {
//   host: "localhost",
//   user: "root",
//   port: "3306",
//   password: "abcd",
//   database: "nodejs",
// };

var connection = mysql.createPool({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
});

module.exports = {
  con: connection,
};
