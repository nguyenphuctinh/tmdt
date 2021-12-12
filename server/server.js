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

app.post("/login", (req, res) => {
  con.query(
    `SELECT * FROM user where username='${req.body.username}' and
                password='${req.body.password}'`,
    function (err, data) {
      console.log(data);
      if (err || data.length == 0)
        res.status(422).send("Tai khoan hoac mat khau khong dung");
      else res.status(200).send("Đăng nhập thành công!");
    }
  );
});
app.post("/user/insert", (req, res) => {
  if (req.body.username === "lol") res.send("Error");
  var sql = `INSERT INTO user VALUES (default,'${req.body.username}', '${req.body.password}',20)`;

  con.query(sql, function (err, result) {
    if (err) res.status(422).send("Error");
    else res.send("ok");
  });
});

app.get("/user", (req, res) => {
  con.query("SELECT * FROM user", function (err, result, fields) {
    if (err) res.send("Error");
    res.json(result);
  });
});

const port = process.env.PORT || 8080;

app.listen(port);
