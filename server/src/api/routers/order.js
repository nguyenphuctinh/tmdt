import express from "express";
import authenToken from "../middlewares/authenToken.js";
import con from "../../config/connection.js";
import passwordHash from "password-hash";
import authenAdminToken from "../middlewares/authenAdminToken.js";
const router = express.Router();
router.post("/", async (req, res) => {
  if (!req.body.userId) {
    return res.status(400).send("userId is required");
  }
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
        console.log(productVariant);
        return res.status(400).json({
          stt: 400,
          message: `${productVariant.productName || "Sản phẩm"} ${
            productVariant.variantValues?.reduce((a, b) => {
              return a + "" + b.value + " ";
            }, "") || " "
          } hiện hết hàng hoặc trong kho không đủ!`,
        });
      }
    }
    const newOrderId = await new Promise((resolve, reject) => {
      const stm = "insert into orders values (default, ?, ?,?, ?)";
      con.query(
        stm,
        [
          req.body.userId,
          new Date(),
          parseFloat(req.body.coupons),
          "chờ xác nhận",
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            reject({ stt: 500, message: "SQL error" });
          }
          resolve(JSON.parse(JSON.stringify(result)).insertId);
        }
      );
    });
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
            const rows = JSON.parse(JSON.stringify(result));
            if (rows.length === 0) {
              reject({ stt: 404, message: "Product variant not found" });
            }
            resolve(JSON.parse(JSON.stringify(result))[0].quantity);
          }
        );
      });
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
    }
    res.send({ stt: 200, message: "Order thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ stt: 500, message: " error" });
  }
});
router.get("/management", authenAdminToken, async (req, res) => {
  try {
    let data = [];
    const orders = await new Promise((resolve, reject) => {
      const stm = "select * from orders order by order_date desc";

      con.query(stm, [], function (err, result) {
        if (err) {
          console.log(err);
          reject({ stt: 500, message: "SQL error" });
        }
        console.log(result);

        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    for (const [i, order] of orders.entries()) {
      const user = await new Promise((resolve, reject) => {
        const stm =
          "select id as userId, first_name as firstName, last_name as lastName, dob, phone, address, points from user where id=?";
        con.query(stm, [order.user_id], function (err, result) {
          if (err) {
            console.log(err);
            reject({ stt: 500, message: "SQL error" });
          }
          resolve(JSON.parse(JSON.stringify(result)));
        });
      });
      console.log(user);
      const rows = await new Promise((resolve, reject) => {
        const stm = "select * from order_item where order_id=?";
        con.query(stm, [order.order_id], function (err, result) {
          if (err) {
            console.log(err);
            reject({ stt: 500, message: "SQL error" });
          }
          resolve(JSON.parse(JSON.stringify(result)));
        });
      });
      console.log(order.coupons);
      data.push({
        user: user[0],
        orderId: order.order_id,
        orderDate: order.order_date,
        orderStatus: order.status,
        coupons: order.coupons,
        orderItems: [],
      });
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
        data[i].orderItems.push({
          productVariantId: item.product_variant_id,
          productName: product.product_name,
          variantValues: [...variantValues],
          imgSrc: imgLink,
          quantity: item.quantity,
          sale: item.sale,
          price: item.unit_price,
        });
      }
    }
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi hệ thống");
  }
});
router.get("/:userId", authenToken, async (req, res) => {
  try {
    let data = [];
    const stm = "select * from orders where user_id=? order by order_date desc";
    const orders = await new Promise((resolve, reject) => {
      con.query(stm, [req.params.userId], function (err, result) {
        if (err) {
          console.log(err);
          reject({ stt: 500, message: "SQL error" });
        }

        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    for (const [i, order] of orders.entries()) {
      const rows = await new Promise((resolve, reject) => {
        const stm = "select * from order_item where order_id=?";
        con.query(stm, [order.order_id], function (err, result) {
          if (err) {
            console.log(err);
            reject({ stt: 500, message: "SQL error" });
          }
          resolve(JSON.parse(JSON.stringify(result)));
        });
      });
      data.push({
        orderId: order.order_id,
        orderDate: order.order_date,
        orderStatus: order.status,
        coupons: order.coupons,
        orderItems: [],
      });
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
        data[i].orderItems.push({
          productVariantId: item.product_variant_id,
          productName: product.product_name,
          variantValues: [...variantValues],
          imgSrc: imgLink,
          quantity: item.quantity,
          sale: item.sale,
          price: item.unit_price,
        });
      }
    }
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi hệ thống");
  }
});
router.put("/:orderId", authenAdminToken, async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      const stm = "update orders set status=? where order_id=?";
      con.query(
        stm,
        [req.body.status, req.params.orderId],
        function (err, result) {
          if (err) {
            console.log(err);
            reject({ stt: 500, message: "SQL error" });
          }
          resolve(JSON.parse(JSON.stringify(result)));
        }
      );
    });

    res.send({ stt: 200, message: "Cập nhật thành công" });
  } catch (error) {}
});
export default router;
