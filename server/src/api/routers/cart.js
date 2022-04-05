import express from "express";
import authenToken from "../middlewares/authenToken.js";
import con from "../../config/connection.js";
import passwordHash from "password-hash";
import authenAdminToken from "../middlewares/authenAdminToken.js";
const router = express.Router();
router.get("/:userId", async (req, res) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      const stm = "SELECT * FROM cart WHERE user_id = ?";
      con.query(stm, [req.params.userId], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ err: "Loi Sql" });
        }
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    const data = {
      userId: req.params.userId,
      cartItems: [],
    };
    for (const item of rows) {
      const product = await new Promise((resolve, reject) => {
        const stm = `SELECT * FROM product_variant
                    join product
                    on product.product_id=product_variant.product_id
                    where product_variant_id = ?`;
        con.query(stm, [item.product_variant_id], (err, result) => {
          if (err) {
            console.log(err);
            return reject({ err: "Loi Sql" });
          }
          const products = JSON.parse(JSON.stringify(result));
          resolve(products[0]);
        });
      });
      const variantValues = await new Promise((resolve, reject) => {
        const stm = `SELECT variant_name as variantName, value FROM product_detail
                    join variant_value
                    on product_detail.value_id=variant_value.value_id
                    join variant
                    on variant.variant_id = variant_value.variant_id
                    where product_variant_id = ?`;
        con.query(stm, [item.product_variant_id], (err, result) => {
          if (err) {
            console.log(err);
            return reject({ err: "Loi Sql" });
          }

          resolve(JSON.parse(JSON.stringify(result)));
        });
      });

      const imgLink = await new Promise((resolve, reject) => {
        const stm = `SELECT * FROM product_variant_img
                  where product_variant_id = ?

                  order by product_variant_img_id
                  limit 1`;
        con.query(stm, [item.product_variant_id], (err, result) => {
          if (err) {
            console.log(err);
            return reject({ err: "Loi Sql" });
          }
          resolve(JSON.parse(JSON.stringify(result))[0].img);
        });
      });
      const productVariant = await new Promise((resolve, reject) => {
        const stm = `SELECT * FROM product_variant
                  where product_variant_id = ?`;
        con.query(stm, [item.product_variant_id], (err, result) => {
          if (err) {
            console.log(err);
            return reject({ err: "Loi Sql" });
          }
          resolve(JSON.parse(JSON.stringify(result))[0]);
        });
      });
      data.cartItems.push({
        productName: product.product_name,
        variantValues: [...variantValues],
        imgSrc: imgLink,
        quantity: item.quantity,
        sale: product.sale,
        price: productVariant.price,
      });
    }

    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Loi Server" });
  }
});
router.post("/", async (req, res) => {
  try {
    const quantityInStock = await new Promise((resolve, reject) => {
      const stm =
        "select quantity from product_variant where product_variant_id=?";
      con.query(stm, [req.body.productVariantId], function (err, result) {
        if (err) {
          console.log(err);
          reject({ stt: 500, message: "SQL error" });
        }
        console.log(result, req.body.productVariantId);
        const rows = JSON.parse(JSON.stringify(result));
        if (rows.length === 0) {
          reject({ stt: 404, message: "Product variant not found" });
        }
        resolve(JSON.parse(JSON.stringify(result))[0].quantity);
      });
    });
    if (quantityInStock < req.body.quantity) {
      return res.status(400).json({
        stt: 400,
        message: "Số lượng sản phẩm trong kho không đủ",
      });
    }

    await new Promise((resolve, reject) => {
      const stm = "insert into cart values (?, ?, ?)";
      con.query(
        stm,
        [req.body.userId, req.body.productVariantId, req.body.quantity],
        (err, result) => {
          if (err) {
            console.log(err);
            reject({ stt: 500, message: "SQL error" });
          }
          resolve(JSON.parse(JSON.stringify(result)));
        }
      );
    });
    res.send({ stt: 200, message: "Thêm vào giỏ hàng thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi hệ thống");
  }
});
export default router;
