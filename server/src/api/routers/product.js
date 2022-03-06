import express, { json } from "express";
import con from "../../config/connection.js";
const router = express.Router();
router.get("/:id", async (req, res) => {
  try {
    let data;
    const product = await new Promise((resolve, reject) => {
      con.query(
        `SELECT * FROM product where product_id = ${req.params.id}`,
        function (err, result) {
          if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
          resolve(JSON.parse(JSON.stringify(result)));
        }
      );
    });
    if (product.length === 0) {
      return res.status(404).send({ err: "Không tìm thấy sản phẩm" });
    }
    const category = product[0].category;
    data = product[0];
    const tmp = await new Promise((resolve, reject) => {
      const sql = `WITH cte AS
                    (
                      SELECT *,
                            ROW_NUMBER() OVER (PARTITION BY variant_id ORDER BY date_time DESC) AS rn
                      FROM ${category}_variant_price
                    )
                    SELECT pv.variant_id, color, capacity,price,quantity
                    FROM cte
                    join ${category}_variant pv
                    on pv.variant_id = cte.variant_id
                    join product p
                    on p.product_id = pv.product_id
                    WHERE rn = 1 and p.product_id = ?`;
      con.query(sql, [product[0].product_id], function (err, result) {
        if (err) return reject({ err: "Lỗi truy vấn" });
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    // console.log(tmp);
    data.variants = [...tmp];
    for (let [j, variant] of data.variants.entries()) {
      const tmp = await new Promise((resolve, reject) => {
        con.query(
          `select img from ${category}_variant_img where variant_id = ?`,
          [variant.variant_id],
          (err, result) => {
            if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
            resolve(JSON.parse(JSON.stringify(result)));
          }
        );
      });
      data.variants[j].imgSrcList = [...tmp];
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export default router;
