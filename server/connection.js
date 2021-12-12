var mysql = require("mysql");

var con = mysql.createConnection({
  host: "us-cdbr-east-05.cleardb.net",
  user: "bcfc9b7ab00c04",
  port: "3306",
  password: "bd6dc0ce",
  database: "heroku_fdea9aba84c6f63",
});
// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "INSERT INTO user VALUES (default,'Tinh', '123',20)";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
// });
module.exports = {
  con: con,
};
