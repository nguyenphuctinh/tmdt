import express from "express";
import authenToken from "../middlewares/authenToken.js";
import con from "../../config/connection.js";
import passwordHash from "password-hash";
import authenAdminToken from "../middlewares/authenAdminToken.js";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    for (const productVariant of req.body.productVariants) {
      const quantityInStock = await new Promise((resolve, reject) => {
        const stm =
          "select quantity from product_variant where product_variant_id=?";
        con.query(
          stm,
          [productVariant.productVariantId],
          function (err, result) {
            if (err) {
              console.log(err);
              reject({ stt: 500, message: "SQL error" });
            }
            console.log(result, productVariant.productVariantId);
            const rows = JSON.parse(JSON.stringify(result));
            if (rows.length === 0) {
              reject({ stt: 404, message: "Product variant not found" });
            }
            resolve(JSON.parse(JSON.stringify(result))[0].quantity);
          }
        );
      });
      if (quantityInStock < productVariant.quantity) {
        return res.status(400).json({
          stt: 400,
          message: "Số lượng sản phẩm trong kho không đủ",
        });
      }
      await new Promise((resolve, reject) => {
        const sql = `update product_variant set quantity = ? where product_variant_id = ?`;
        con.query(
          sql,
          [
            quantityInStock - productVariant.quantity,
            productVariant.productVariantId,
          ],
          function (err, result) {
            if (err) {
              console.log(err);
              reject({ err: "SQL error" });
            }
            resolve();
          }
        );
      });
      const newOrderId = await new Promise((resolve, reject) => {
        const stm = "insert into orders values (default, ?, ?, ?)";
        con.query(
          stm,
          [req.body.userId, new Date(), "chờ xác nhận"],
          (err, result) => {
            if (err) {
              console.log(err);
              reject({ stt: 500, message: "SQL error" });
            }
            resolve(JSON.parse(JSON.stringify(result)).insertId);
          }
        );
      });
      console.log(req.body);
      await new Promise((resolve, reject) => {
        const stm = "insert into order_item values (?, ?, ?, ?, ?)";
        con.query(
          stm,
          [
            newOrderId,
            productVariant.productVariantId,
            productVariant.quantity,
            productVariant.price,
            productVariant.sale,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
              reject({ stt: 500, message: "SQL error" });
            }
            resolve(JSON.parse(JSON.stringify(result)));
          }
        );
      });
      res.send({ stt: 200, message: "Order thành công" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi hệ thống");
  }
});
export default router;
