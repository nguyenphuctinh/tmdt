import express from "express";
import authenToken from "../middlewares/authenToken.js";
import con from "../../config/connection.js";
import passwordHash from "password-hash";
const router = express.Router();
router.get("/", authenToken, (req, res) => {
  con.query("SELECT * FROM user", function (err, result) {
    if (err) return res.send("Error");
    res.send(result);
  });
});
router.post("/", async (req, res) => {
  var sql = "select * from user where username=?";
  try {
    await new Promise((resolve, reject) => {
      con.query(sql, [req.body.username], (err, data) => {
        if (err) {
          console.log(err);
          reject({ stt: 500, err: "Lỗi truy vấn" });
          return;
        }
        if (data.length !== 0) {
          return reject({ stt: 400, err: "Tài khoản đã tồn tại" });
        }
        resolve("ok");
      });
    });
    await new Promise((resolve, reject) => {
      sql = `INSERT INTO user VALUES (default,?,?,20,default)`;
      con.query(
        sql,
        [req.body.username, passwordHash.generate(req.body.password)],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject({ stt: 500, err: "Loi SQL" });
          }
          res.send("Đăng ký thành công");
          resolve();
        }
      );
    });
  } catch ({ stt, err }) {
    return res.status(stt).send(err);
  }
});
router.delete("/:id", (req, res) => {
  con.query(
    `delete FROM user where id=${req.params.id} `,
    function (err, result) {
      if (err) return res.status(500).send("Lỗi truy vấn");
      res.status(200).send("xóa thành công");
    }
  );
});
router.put("/:id", async (req, res) => {
  var sql = "select * from user where username=?";
  try {
    await new Promise((resolve, reject) => {
      con.query(sql, [req.body.username], (err, data) => {
        if (err) {
          console.log(err);
          reject({ stt: 500, err: "Lỗi SQL" });
          return;
        }
        if (data.length !== 0) {
          reject({ stt: 400, err: "Tài khoản đã tồn tại" });
          return;
        }
        resolve("ok");
      });
    });
  } catch ({ stt, err }) {
    return res.status(stt).send(err);
  }
  con.query(
    `update user set username='${req.body.username}', password='${req.body.password}' where id=${req.params.id} `,
    function (err, result) {
      if (err) return res.status(500).send("Lỗi SQL");
      res.status(200).send("cap nhat thành công");
    }
  );
});

export default router;
