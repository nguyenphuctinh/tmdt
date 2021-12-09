var mysql = require("mysql");

var con = mysql.createConnection({
  host: "8.tcp.ngrok.io",
  user: "root",
  port: "11446",
  password: "abcd",
  database: "nodejs",
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
