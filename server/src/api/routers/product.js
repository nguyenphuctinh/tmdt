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
    data = product[0];
    const tmp = await new Promise((resolve, reject) => {
      const sql = `WITH cte AS
                    (
                      SELECT *,
                            ROW_NUMBER() OVER (PARTITION BY phone_variant_id ORDER BY date_time DESC) AS rn
                      FROM phone_variant_price
                    )
                    SELECT pv.phone_variant_id, phone_color, phone_capacity,price,phone_quantity
                    FROM cte
                    join phone_variant pv
                    on pv.phone_variant_id = cte.phone_variant_id
                    join product p
                    on p.product_id = pv.product_id
                    WHERE rn = 1 and p.product_id = ?`;
      con.query(sql, [product[0].product_id], function (err, result) {
        if (err) return reject({ err: "Lỗi truy vấn" });
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    // console.log(tmp);
    data.phone_variants = [...tmp];
    for (let [j, phone_variant] of data.phone_variants.entries()) {
      const tmp = await new Promise((resolve, reject) => {
        con.query(
          "select img from phone_variant_img where phone_variant_id = ?",
          [phone_variant.phone_variant_id],
          (err, result) => {
            if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
            resolve(JSON.parse(JSON.stringify(result)));
          }
        );
      });
      data.phone_variants[j].imgSrcList = [...tmp];
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export default router;
