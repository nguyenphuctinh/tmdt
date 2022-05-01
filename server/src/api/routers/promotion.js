import express from "express";
import con from "../../config/connection.js";
import { addDays } from "../helpers/dateCalculation.js";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      const stm = "SELECT * FROM promotion  order by promotion_id desc ";
      con.query(stm, [new Date()], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ err: "Loi Sql" });
        }
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    let data = [];
    for (const promotion of rows) {
      const saledProducts = await new Promise((resolve, reject) => {
        const stm =
          "SELECT product_id as productId,sale FROM promotion_product where promotion_id = ?";
        con.query(stm, [promotion.promotion_id], (err, result) => {
          if (err) {
            console.log(err);
            return reject({ err: "Loi Sql" });
          }
          resolve(JSON.parse(JSON.stringify(result)));
        });
      });

      data.push({
        promotionId: promotion.promotion_id,
        promotionName: promotion.promotion_name,
        promotionStartTime: promotion.promotion_start_time,
        promotionExpTime: promotion.promotion_exp_time,
        promotionImg: promotion.img,
        saledProducts: [...saledProducts],
      });
    }

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
      // console.log(product.sale);
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
router.put("/:id", async (req, res) => {
  if (req.body.type === "deleteProduct") {
    try {
      await new Promise((resolve, reject) => {
        const stm =
          "delete from promotion_product where product_id = ? and promotion_id = ?";
        con.query(stm, [req.body.productId, req.params.id], (err, result) => {
          if (err) {
            console.log(err);
            return reject({ err: "Loi Sql" });
          }
          resolve();
        });
      });
      res.send("Xoa thanh cong");
    } catch (error) {
      res.status(500).send(error);
    }
    return;
  }
  if (req.body.type === "update") {
    if (new Date(req.body.endTime) < new Date(req.body.startTime)) {
      res.status(400).json({
        err: "Ngay bat dau khong the hon ngay ket thuc",
      });
      return;
    }

    try {
      await new Promise((resolve, reject) => {
        const stm = `select * from promotion 
          where (promotion_exp_time >= ? and promotion_start_time <= ?
          or promotion_exp_time <= ? and promotion_start_time >= ?
          or promotion_exp_time >= ? and promotion_start_time >= ? and promotion_start_time <= ?
          or promotion_exp_time <= ? and promotion_start_time <= ? and promotion_exp_time >= ?)
          and promotion_id != ?
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
            parseInt(req.params.id),
          ],
          (err, result) => {
            if (err) {
              console.log(err);
              return reject({ err: "Loi Sql" });
            }
            if (result.length > 0) {
              console.log(result);
              return reject({ err: "Sự kiện bị trùng thời gian" });
            }
            resolve();
          }
        );
      });
      await new Promise((resolve, reject) => {
        const stm =
          "update promotion set promotion_name = ?, promotion_start_time = ?, promotion_exp_time = ? where promotion_id = ?";
        con.query(
          stm,
          [
            req.body.ten,
            new Date(req.body.startTime),
            new Date(req.body.endTime),
            req.params.id,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
              return reject({ err: "Loi Sql" });
            }
            resolve();
          }
        );
      });
      res.send("Thanh cong");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  if (req.body.type === "addProduct") {
    try {
      await new Promise((resolve, reject) => {
        const stm = "insert into promotion_product   values(default,?,?,?)";
        con.query(
          stm,
          [req.params.id, req.body.productId, req.body.sale],
          (err, result) => {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Loi Sql" });
            }
            resolve();
          }
        );
      });
      res.send("Thanh cong");
    } catch (error) {
      res.status(500).send(error);
    }
    return;
  }
  res.status(400).send("Type is required");
});
router.delete("/:id", async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      const stm = "delete from promotion where promotion_id = ?";
      con.query(stm, [req.params.id], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ err: "Loi Sql" });
        }
        resolve();
      });
    });
    res.send("Xoa thanh cong");
  } catch (error) {
    res.status(500).send({ message: "Loi" });
  }
});
export default router;
