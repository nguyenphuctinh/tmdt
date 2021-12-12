const express = require("express");
var cors = require("cors");
const { con } = require("./connection");
const app = express();
app.use(cors()); // cho phép client access
app.use(express.json()); // cho cái này mới post dc
app.use(
  express.urlencoded({
    extended: true,
  })
); // cho cái này mới post dc

app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.get("/", (req, res) => {
  res.send("test deploy nodejs NGuyễn Phsuc Tĩnh");
});

app.post("/user/insert", (req, res) => {
  time = new Date();

  var sql = `INSERT INTO user VALUES (default,'${req.body.username}', '${req.body.password}',20)`;
  try {
    con.query(sql, function (err, result) {
      if (err) res.send(Error);
      console.log("1 record inserted");
      // res.send(Success);
    });
  } catch (error) {
    // console.log(error);
  }
});
app.get("/user", (req, res) => {
  con.query("SELECT * FROM user", function (err, result, fields) {
    if (err) res.send(Error);
    res.json(result);
  });
});

const port = process.env.PORT || 8080;

app.listen(port);
