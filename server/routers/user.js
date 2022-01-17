import express from "express";
import authenToken from "../auth/auth.js";
import con from "../connection.js";

const router = express.Router();
router.get("/", authenToken, (req, res) => {
  con.query("SELECT * FROM user", function (err, result) {
    if (err) return res.send("Error");
    res.send(result);
  });
});
router.post("/", async (req, res) => {
  if (req.body.username === "lol") return res.status(400).send("lol");
  var sql = "select * from user where username=?";
  //   console.log(req.body);
  try {
    await new Promise((resolve, reject) => {
      con.query(sql, [req.body.username], (err, data) => {
        if (err) {
          console.log(err);
          reject({ stt: 400, err: "Lỗi truy vấn" });
          return;
        }
        if (data.length !== 0) {
          return reject({ stt: 400, err: "Tài khoản đã tồn tại" });
        }
        resolve("ok");
      });
    });
    sql = `INSERT INTO user VALUES (default,?,?,20)`;
    con.query(sql, [req.body.username, req.body.password], (err, result) => {
      if (err) {
        res.status(422).send("Lỗi truy vấn");
        // console.log(err);
        return;
      }
      res.send("Thêm thành công");
    });
  } catch ({ stt, err }) {
    res.status(stt).send(err);
  }
});
router.delete("/:id", (req, res) => {
  con.query(
    `delete FROM user where id=${req.params.id} `,
    function (err, result) {
      if (err) return res.status(422).send("Lỗi truy vấn");
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

export default router;
