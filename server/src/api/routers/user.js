import express from "express";
import authenToken from "../middlewares/authenToken.js";
import con from "../../config/connection.js";
import passwordHash from "password-hash";
import authenAdminToken from "../middlewares/authenAdminToken.js";
import isPhoneNumber from "../validations/isPhoneNumber.js";
const router = express.Router();
router.get("/", authenToken, async (req, res) => {
  try {
    await new Promise(async (resolve, reject) => {
      con.query(
        "SELECT id,username, first_name as firstName, last_name as lastName, dob, phone, address, points, role, state FROM user where role!=?",
        ["admin"],
        function (err, result) {
          if (err) {
            reject(err);
            return res.send("Error");
          }
          res.send(result);
          resolve();
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/", async (req, res) => {
  if (req.body.type === "anonymous") {
    if (!isPhoneNumber(req.body.phone)) {
      return res.status(400).json({
        stt: 400,
        message: "Số điện thoại không hợp lệ",
      });
    }
    try {
      await new Promise((resolve, reject) => {
        sql = `INSERT INTO user(first_name, last_name, dob,phone,address, role) VALUES (?,?,?,?,?,?)`;

        con.query(
          sql,
          [
            req.body.firstName,
            req.body.lastName,
            req.body.dob,
            req.body.phone,
            req.body.address,
            "anonymous",
          ],
          (err, result) => {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Loi SQL" });
            }
            const userId = JSON.parse(JSON.stringify(result)).insertId;
            res.status(200).send({ userId });
            resolve();
          }
        );
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Lỗi hệ thống");
    }
  } else {
    if (!req.body.username || !req.body.password) {
      return res.send("Username and password is required");
    }
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
        sql = `INSERT INTO user(username, password,first_name, last_name, dob, points, state, role) VALUES (?,?,?,?,?,default,default,default)`;
        con.query(
          sql,
          [
            req.body.username,
            passwordHash.generate(req.body.password),
            req.body.firstName,
            req.body.lastName,
            req.body.dob,
          ],
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
  }
});
router.delete("/:id", authenAdminToken, (req, res) => {
  con.query(
    `delete FROM user where id=${req.params.id} `,
    function (err, result) {
      if (err) return res.status(500).send("Lỗi truy vấn");
      res.status(200).send("xóa thành công");
    }
  );
});
router.put("/:id", authenToken, async (req, res) => {
  if (req.body.type === "updatePassword") {
    if (req.body.password.length === 0) {
      return res.status(400).send("Không được để trống");
    }
    try {
      var sql = "select * from user where username=?";
      const user = await new Promise((resolve, reject) => {
        con.query(sql, [req.params.id], (err, data) => {
          if (err) {
            console.log(err);
            reject({ stt: 500, err: "Lỗi SQL" });
            return;
          }
          if (data.length === 0) {
            return reject({ stt: 400, err: "Tài khoản không tồn tại" });
          }
          resolve(JSON.parse(JSON.stringify(data)));
        });
      });
      console.log(req.body.password, user[0].password);
      if (!passwordHash.verify(req.body.password, user[0].password)) {
        return res.status(400).send("Mật khẩu không đúng");
      }
      await new Promise((resolve, reject) => {
        con.query(
          `update user set  password='${passwordHash.generate(
            req.body.newPassword
          )}' where username='${req.params.id}' `,
          function (err, result) {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Lỗi truy vấn" });
            }
            resolve();
          }
        );
      });
      res.status(200).send("cập nhật thành công");
    } catch ({ stt, err }) {
      return res.status(stt).send(err);
    }
  }
  if (req.body.type === "updateInfo") {
    if (req.body.phone && !isPhoneNumber(req.body.phone)) {
      return res.status(400).json({
        stt: 400,
        message: "Số điện thoại không hợp lệ",
      });
    }
    try {
      await new Promise((resolve, reject) => {
        con.query(
          "update user set first_name=?,last_name=?,phone=?, dob=?,address=? where id =?",
          [
            req.body.firstName,
            req.body.lastName,
            req.body.phone,
            req.body.dob,
            req.body.address,
            req.params.id,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Lỗi truy vấn" });
            }
            resolve();
          }
        );
      });
      res.send("cập nhật thành công");
    } catch (error) {
      console.log(error);
      return res.status(500).send("error");
    }
  }
  if (req.body.type === "updatePoints") {
    try {
      await new Promise((resolve, reject) => {
        con.query(
          `update user set  points=${req.body.points} where id=${req.params.id} `,
          function (err, result) {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Lỗi truy vấn" });
            }
            resolve();
          }
        );
      });
      res.send("cập nhật thành công");
    } catch (error) {
      console.log(error);
      return res.status(500).send("error");
    }
  }
});
router.put("/management/:id", authenAdminToken, async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      const stm = "update user set state = ? where id = ?";
      con.query(stm, [req.body.state, req.params.id], (err, result) => {
        if (err) {
          return reject({ stt: 500, err: "Lỗi truy vấn" });
        }
        resolve();
      });
    });
    res.send("Cập nhật thành công!");
  } catch (error) {
    console.log(error);
    return res.status(500).send("error");
  }
});
export default router;
