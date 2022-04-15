import express from "express";
import con from "../../config/connection.js";
import { addDays } from "../helpers/dateCalculation.js";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      const stm = "SELECT * FROM promotion where   promotion_exp_time >= ?";
      con.query(stm, [new Date()], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ err: "Loi Sql" });
        }
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    let data = [];
    rows.forEach((element) => {
      data.push({
        promotionId: element.promotion_id,
        promotionName: element.promotion_name,
        promotionStartTime: element.promotion_start_time,
        promotionExpTime: element.promotion_exp_time,
        promotionImg: element.img,
      });
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Loi Server",
      error: error,
    });
  }
});
router.post("/", async (req, res) => {
  // neu expTime > startTime thi se dien ra
  if (new Date(req.body.endTime) < new Date(req.body.startTime)) {
    res.status(400).json({
      err: "Ngay bat dau khong the hon ngay ket thuc",
    });
    return;
  }
  if (new Date(req.body.endTime) < new Date()) {
    res.status(400).json({
      err: "Ngay ket thuc khong the nho hon ngay hien tai",
    });
    return;
  }
  try {
    await new Promise((resolve, reject) => {
      const stm = `select * from promotion 
          where promotion_exp_time >= ? and promotion_start_time <= ?
          or promotion_exp_time <= ? and promotion_start_time >= ?
          or promotion_exp_time >= ? and promotion_start_time >= ? and promotion_start_time <= ?
          or promotion_exp_time <= ? and promotion_start_time <= ? and promotion_exp_time >= ?
          `;
      con.query(
        stm,
        [
          new Date(req.body.endTime),
          new Date(req.body.startTime),
          new Date(req.body.endTime),
          new Date(req.body.startTime),
          new Date(req.body.endTime),
          new Date(req.body.startTime),
          new Date(req.body.endTime),
          new Date(req.body.endTime),
          new Date(req.body.startTime),
          new Date(req.body.startTime),
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject({ err: "Loi Sql" });
          }
          if (result.length > 0) {
            return reject({ err: "Sự kiện bị trùng thời gian" });
          }
          resolve();
        }
      );
    });
    const newOrderId = await new Promise((resolve, reject) => {
      const stm = "insert into promotion values(default,?,?,?,?)";
      con.query(
        stm,
        [
          req.body.ten,
          new Date(req.body.startTime),
          new Date(req.body.endTime),
          req.body.imgSrc,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject({ err: "Loi Sql" });
          }
          resolve(JSON.parse(JSON.stringify(result)).insertId);
        }
      );
    });
    for (const product of req.body.saledProducts) {
      await new Promise((resolve, reject) => {
        const stm = "insert into promotion_product   values(default,?,?,?)";
        con.query(
          stm,
          [newOrderId, product.productId, parseFloat(product.sale)],
          (err, result) => {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Loi Sql" });
            }
            resolve();
          }
        );
      });
    }
    res.send("Thanh cong");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
export default router;
