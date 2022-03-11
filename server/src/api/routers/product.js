import express, { json } from "express";
import con from "../../config/connection.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let data = [];
    const products = await new Promise((resolve, reject) => {
      con.query(
        `SELECT * FROM product order by product_id desc`,
        function (err, result) {
          if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
          resolve(JSON.parse(JSON.stringify(result)));
        }
      );
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
            `select * from product_variant_img where product_variant_id = ?`,
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
        let tmp = {}; // object chứa các tên variant và giá trị của nó
        for (const valueId of valueIds) {
          const variantValue = await new Promise((resolve, reject) => {
            con.query(
              `select * from variant_value join variant 
              on variant.variant_id = variant_value.variant_id
              where value_id = ?`,
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
          quantity: productVariant.quantity,
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
      addProductVariant(newProductId, productVariant, req.body.variantNames);
    }
    res.send({ productId: newProductId, mess: "Đăng thành công!" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.put("/:productId", async (req, res) => {
  console.log(req.body, req.params.productId);
  const productId = parseInt(req.params.productId);
  const productVariant = req.body.productVariant;
  if (req.body.type === "updateProductVariant") {
    try {
      await new Promise((resolve, reject) => {
        const sql = `insert into product_variant_price values(default,?,?,?)`;
        con.query(
          sql,
          [
            productVariant.productVariantId,
            parseInt(productVariant.price),
            new Date(),
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
      await new Promise((resolve, reject) => {
        const sql = `update product_variant set quantity = ? where product_variant_id = ?`;
        con.query(
          sql,
          [parseInt(productVariant.quantity), productVariant.productVariantId],
          (err, result) => {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Lỗi truy vấn" });
            }
            resolve();
          }
        );
      });

      for (const variantName of req.body.variantNames) {
        let value_id = await new Promise((resolve, reject) => {
          const sql = `SELECT * FROM variant_value
                    join variant
                    on variant.variant_id= variant_value.variant_id
                    where variant_name =? and value = ?`;
          con.query(
            sql,
            [variantName, productVariant[variantName]],
            (err, result) => {
              if (err) {
                console.log(err);
                return reject({ stt: 500, err: "Lỗi truy vấn" });
              }
              if (result.length === 0) {
                resolve(null);
              } else resolve(JSON.parse(JSON.stringify(result))[0]["value_id"]);
            }
          );
        });
        const product_detail_id = await new Promise((resolve, reject) => {
          con.query(
            `SELECT * FROM product_detail
              join variant_value
              on variant_value.value_id=product_detail.value_id
              join variant
              on variant.variant_id= variant_value.variant_id
              where product_variant_id=? and variant_name = ?
              `,
            [productVariant.productVariantId, variantName],
            (err, result) => {
              if (err) {
                console.log(err);
                return reject({ stt: 500, err: "Lỗi truy vấn" });
              }
              console.log(
                JSON.parse(JSON.stringify(result))[0].product_detail_id,
                value_id
              );
              resolve(JSON.parse(JSON.stringify(result))[0].product_detail_id);
            }
          );
        });
        if (!value_id) {
          const variantId = await new Promise((resolve, reject) => {
            con.query(
              "select variant_id from variant where variant_name = ?",
              [variantName],
              (err, result) => {
                if (err) {
                  console.log(err);
                  return reject({ stt: 500, err: "Lỗi truy vấn" });
                }
                resolve(JSON.parse(JSON.stringify(result))[0].variant_id);
              }
            );
          });
          value_id = await new Promise((resolve, reject) => {
            const sql = `insert into variant_value
                          values(default,?,?)`;
            con.query(
              sql,
              [variantId, productVariant[variantName]],
              (err, result) => {
                if (err) {
                  console.log(err);
                  return reject({ stt: 500, err: "Lỗi truy vấn" });
                }
                resolve(JSON.parse(JSON.stringify(result)).insertId);
              }
            );
          });
          await new Promise((resolve, reject) => {
            con.query(
              "insert into product_detail values(default, ?,?)",
              [productVariant.productVariantId, value_id],
              (err, result) => {
                if (err) {
                  console.log(err);
                  return reject({ stt: 500, err: "Lỗi truy vấn" });
                }
                resolve();
              }
            );
          });
          await new Promise((resolve, reject) => {
            con.query(
              `DELETE FROM product_detail WHERE product_detail_id=?`,
              [product_detail_id],
              (err, result) => {
                if (err) {
                  console.log(err);
                  return reject({ stt: 500, err: "Lỗi truy vấn" });
                }
                resolve();
              }
            );
          });
        } else {
          console.log(value_id, productVariant.productVariantId);

          console.log("product_detail_id", product_detail_id);
          await new Promise((resolve, reject) => {
            const sql = `update product_detail set value_id = ? where product_detail_id = ?`;
            con.query(sql, [value_id, product_detail_id], (err, result) => {
              if (err) {
                console.log(err);
                return reject({ stt: 500, err: "Lỗi truy vấn" });
              }
              resolve();
            });
          });
        }
      }
      res.send("Cập nhật thành công!");
    } catch (error) {
      console.log(error);
      res.status(500).send("error");
    }
  } else if (req.body.type === "updateProductNameAndSale") {
    try {
      await new Promise((resolve, reject) => {
        const sql = `update product set product_name = ?, sale = ? where product_id = ?`;
        con.query(
          sql,
          [req.body.productName, req.body.sale, req.params.productId],
          (err, result) => {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Lỗi truy vấn" });
            }
            resolve();
          }
        );
      });
      res.send("Cập nhật thành công!");
    } catch (error) {
      console.log(error);
      res.status(500).send("error");
    }
  } else if (req.body.type === "addProductVariant") {
    addProductVariant(
      req.params.productId,
      req.body.productVariant,
      req.body.variantNames
    );
    res.send("Cập nhật thành công!");
  }
});
const addProductVariant = async (productId, productVariant, variantNames) => {
  const newProductVariantId = await new Promise((resolve, reject) => {
    const sql = "insert into product_variant values(default,?,?)";
    con.query(sql, [productId, productVariant.quantity], (err, result) => {
      if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
      resolve(JSON.parse(JSON.stringify(result)).insertId);
    });
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
  for (const variantName of variantNames) {
    const variantId = await new Promise((resolve, reject) => {
      con.query(
        "select variant_id from variant where variant_name = ?",
        [variantName],
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
      con.query(
        sql,
        [variantName, productVariant[variantName]],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject({ stt: 500, err: "Lỗi truy vấn" });
          }
          if (result.length === 0) {
            resolve(null);
          } else resolve(JSON.parse(JSON.stringify(result))[0]["value_id"]);
        }
      );
    });
    if (!value_id) {
      value_id = await new Promise((resolve, reject) => {
        const sql = `insert into variant_value
                          values(default,?,?)`;
        con.query(
          sql,
          [variantId, productVariant[variantName]],
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
};
router.delete(
  "/:productId/productVariants/:productVariantId",
  async (req, res) => {
    try {
      await new Promise((resolve, reject) => {
        const sql = `DELETE FROM product_variant WHERE product_variant_id = ?`;
        con.query(
          sql,
          [parseInt(req.params.productVariantId)],
          (err, result) => {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Lỗi truy vấn" });
            }
            resolve();
          }
        );
      });
      res.send("Xóa thành công!");
    } catch (error) {
      console.log(error);
      res.status(500).send("error");
    }
  }
);
router.delete("/:productId", async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      const sql = `DELETE FROM product WHERE product_id = ?`;
      con.query(sql, [parseInt(req.params.productId)], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ stt: 500, err: "Lỗi truy vấn" });
        }
        resolve();
      });
    });
    res.send("Xóa thành công!");
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
});
export default router;
