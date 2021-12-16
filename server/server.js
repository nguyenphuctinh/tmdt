const express = require("express");
var cors = require("cors");
const { con } = require("./connection");
const app = express();
app.use(cors()); // cho phép client access
app.use(express.json()); // cho cái này mới nhan dc json dc
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.post("/login", (req, res) => {
  const stm = "SELECT * FROM user where username=? and password=?";
  con.query(stm, [req.body.username, req.body.password], function (err, data) {
    if (err || data.length == 0)
      return res.status(422).send("Tai khoan hoac mat khau khong dung");
    res.status(200).send("Đăng nhập thành công!");
  });
});
app.post("/api/users", async (req, res) => {
  if (req.body.username === "lol") return res.status(400).send("lol");
  var sql = "select * from user where username=?";
  try {
    await new Promise((resolve, reject) => {
      con.query(sql, [req.body.username], (err, data) => {
        if (err) {
          console.log(err);
          reject({ stt: 400, err: "Lỗi truy vấn" });
          return;
        }
        if (data.length !== 0)
          return reject({ stt: 400, err: "Tài khoản đã tồn tại" });
        console.log("lol");
        resolve("ok");
      });
    });
    sql = `INSERT INTO user VALUES (default,?,?,20)`;
    con.query(sql, [req.body.username, req.body.password], (err, result) => {
      if (err) {
        res.status(422).send("Lỗi truy vấn");
        return;
      }
      res.send("Thêm thành công");
    });
  } catch ({ stt, err }) {
    res.status(stt).send(err);
  }
});

app.get("/api/users", (req, res) => {
  con.query("SELECT * FROM user", function (err, result, fields) {
    if (err) return res.send("Error");
    res.send(result);
  });
});
app.delete("/api/users/:id", (req, res) => {
  con.query(
    `delete FROM user where id=${req.params.id} `,
    function (err, result) {
      if (err) return res.status(422).send("Lỗi truy vấn");
      res.status(200).send("xóa thành công");
    }
  );
});
app.put("/api/users/:id", async (req, res) => {
  var sql = "select * from user where username=?";
  try {
    await new Promise((resolve, reject) => {
      con.query(sql, [req.body.username], (err, data) => {
        if (err) {
          console.log(err);
          reject({ stt: 400, err: "Lỗi truy vấn" });
          return;
        }
        if (data.length !== 0) {
          reject({ stt: 400, err: "Tài khoản đã tồn tại" });
          return;
        }
        resolve("ok");
      });
    });
    con.query(
      `update user set username='${req.body.username}', password='${req.body.password}' where id=${req.params.id} `,
      function (err, result) {
        if (err) return res.status(422).send("Lỗi truy vấn");
        res.status(200).send("cap nhat thành công");
      }
    );
  } catch ({ stt, err }) {
    res.status(stt).send(err);
  }
});

const port = process.env.PORT || 8080;

app.listen(port);
