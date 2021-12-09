const express = require("express");
const { con } = require("./connection");
const app = express();
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
app.get("/", (req, res) => {
  res.send("test deploy nodejs NGuyễn Phsuc Tĩnh");
});
app.get("/user", (req, res) => {
  res.json([
    { name: "Tĩnh", age: 20 },
    { name: "Việt Anh", age: 20 },
    { name: "Huyền Anh", age: 18 },
  ]);
  time = new Date();
  console.log();

  var sql = `INSERT INTO user VALUES (default,'${time
    .toTimeString()
    .slice(0, 5)}', '123',20)`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
const port = process.env.PORT || 3000;

app.listen(port);
