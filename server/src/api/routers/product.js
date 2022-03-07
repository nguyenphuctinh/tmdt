import express, { json } from "express";
import con from "../../config/connection.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let data = [];
    const products = await new Promise((resolve, reject) => {
      con.query(`SELECT * FROM product`, function (err, result) {
        if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    for (const [i, product] of products.entries()) {
      data.push({
        productId: product.product_id,
        productName: product.product_name,
        sale: product.sale,
        category: product.category,
        productVariants: [],
        variants: {},
      });
      const productVariants = await new Promise((resolve, reject) => {
        con.query(
          `select * from product_variant where product_id = ?`,
          [product.product_id],
          (err, result) => {
            if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
            resolve(JSON.parse(JSON.stringify(result)));
          }
        );
      });
      for (const productVariant of productVariants) {
        const price = await new Promise((resolve, reject) => {
          const sql = `WITH cte AS
                    (
                      SELECT *,
                            ROW_NUMBER() OVER (PARTITION BY product_variant_id ORDER BY date_time DESC) AS rn
                      FROM product_variant_price
                    )
                    SELECT price
                    FROM cte
                    join product_variant pv
                    on pv.product_variant_id = cte.product_variant_id
                    WHERE rn = 1 and pv.product_variant_id = ?`;
          con.query(
            sql,
            [productVariant.product_variant_id],
            function (err, result) {
              if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
              resolve(JSON.parse(JSON.stringify(result))[0].price);
            }
          );
        });
        const imgSrcList = await new Promise((resolve, reject) => {
          con.query(
            `select img from product_variant_img where product_variant_id = ?`,
            [productVariant.product_variant_id],
            (err, result) => {
              if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });

              resolve(JSON.parse(JSON.stringify(result)));
            }
          );
        });
        const valueIds = await new Promise((resolve, reject) => {
          con.query(
            `select value_id from product_detail where product_variant_id = ? `,
            [productVariant.product_variant_id],
            (err, result) => {
              if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
              resolve(JSON.parse(JSON.stringify(result)));
            }
          );
        });
        let tmp = {};
        for (const valueId of valueIds) {
          const variantValue = await new Promise((resolve, reject) => {
            con.query(
              `select * from variant_value join variant 
              on variant.variant_id = variant_value.variant_id
              where value_id = ? order by value`,
              [valueId.value_id],
              (err, result) => {
                if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
                resolve(JSON.parse(JSON.stringify(result))[0]);
              }
            );
          });
          if (!data[i]["variants"][variantValue.variant_name]) {
            data[i]["variants"][variantValue.variant_name] = [
              variantValue.value,
            ];
          } else if (
            !data[i]["variants"][variantValue.variant_name].includes(
              variantValue.value
            )
          ) {
            data[i]["variants"][variantValue.variant_name].push(
              variantValue.value
            );
          }
          tmp = { ...tmp, [variantValue.variant_name]: variantValue.value };
        }
        data[i]["productVariants"].push({
          ...tmp,
          imgSrcList,
          price,
          productVariantId: productVariant.product_variant_id,
        });
      }
    }
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.post("/", async (req, res) => {
  try {
    const newProductId = await new Promise((resolve, reject) => {
      const sql = "insert into product values(default, ?,?,?)";
      con.query(
        sql,
        [req.body.name, req.body.sale, req.body.category],
        (err, result) => {
          if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
          resolve(JSON.parse(JSON.stringify(result)).insertId);
        }
      );
    });
    for (const productVariant of req.body.productVariants) {
      const newProductVariantId = await new Promise((resolve, reject) => {
        const sql = "insert into product_variant values(default,?,?)";
        con.query(
          sql,
          [newProductId, productVariant.quantity],
          (err, result) => {
            if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
            resolve(JSON.parse(JSON.stringify(result)).insertId);
          }
        );
      });
      await new Promise((resolve, reject) => {
        const sql = "insert into product_variant_price values(default,?,?,?)";
        con.query(
          sql,
          [newProductVariantId, productVariant.price, new Date()],
          (err, result) => {
            if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
            resolve();
          }
        );
      });
      for (const img of productVariant.imgSrcList) {
        await new Promise((resolve, reject) => {
          const sql = "insert into product_variant_img values(default,?,?)";
          con.query(sql, [newProductVariantId, img], (err, result) => {
            if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
            resolve();
          });
        });
      }
      for (const variant of req.body.variants) {
        const variantId = await new Promise((resolve, reject) => {
          con.query(
            "select variant_id from variant where variant_name = ?",
            [variant],
            (err, result) => {
              if (err) {
                console.log(err);
                return reject({ stt: 500, err: "Lỗi truy vấn" });
              }
              resolve(JSON.parse(JSON.stringify(result))[0].variant_id);
            }
          );
        });
        // nếu như không tồn tại variant_value này thì mới insert vào
        let value_id = await new Promise((resolve, reject) => {
          const sql = `SELECT * FROM variant_value
                    join variant
                    on variant.variant_id= variant_value.variant_id
                    where variant_name =? and value = ?`;
          con.query(sql, [variant, productVariant[variant]], (err, result) => {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Lỗi truy vấn" });
            }
            if (result.length === 0) {
              resolve(null);
            } else resolve(JSON.parse(JSON.stringify(result))[0]["value_id"]);
          });
        });
        if (!value_id) {
          value_id = await new Promise((resolve, reject) => {
            const sql = `insert into variant_value
                          values(default,?,?)`;
            con.query(
              sql,
              [variantId, productVariant[variant]],
              (err, result) => {
                if (err) {
                  console.log(err);
                  return reject({ stt: 500, err: "Lỗi truy vấn" });
                }
                resolve(JSON.parse(JSON.stringify(result)).insertId);
              }
            );
          });
        }
        await new Promise((resolve, reject) => {
          con.query(
            "insert into product_detail values(default, ?,?)",
            [newProductVariantId, value_id],
            (err, result) => {
              if (err) {
                console.log(err);
                return reject({ stt: 500, err: "Lỗi truy vấn" });
              }
              resolve();
            }
          );
        });
      }
    }
    res.send("Đăng thành công!");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
export default router;
