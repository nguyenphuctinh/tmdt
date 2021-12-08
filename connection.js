var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abcd",
  database: "nodejs",
});

module.exports = {
  con: con,
};
