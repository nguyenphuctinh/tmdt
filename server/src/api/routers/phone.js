import express, { json } from "express";
import con from "../../config/connection.js";
import authenToken from "../middlewares/authenToken.js";
import authenAdminToken from "../middlewares/authenAdminToken.js";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    let data = [];
    const phones = await new Promise((resolve, reject) => {
      con.query(
        `SELECT * FROM product where category ='phone'`,
        function (err, result) {
          if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
          resolve(JSON.parse(JSON.stringify(result)));
        }
      );
    });
    for (const [index, phone] of phones.entries()) {
      data = [...data, { ...phone }];
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
        con.query(sql, [phone.product_id], function (err, result) {
          if (err) return reject({ stt: 500, err: "Lỗi truy vấn" });
          resolve(JSON.parse(JSON.stringify(result)));
        });
      });
      data[index].phone_variants = [...tmp];
    }
    for (let [i, phone] of data.entries()) {
      for (let [j, phone_variant] of phone.phone_variants.entries()) {
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
        data[i].phone_variants[j].imgSrcList = [...tmp];
      }
    }
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
router.post("/", authenAdminToken, async (req, res, next) => {
  console.log(req.body.variants[0].imgSrcList);
  try {
    const sql = `INSERT INTO product VALUES (default,?,?,'phone')`;
    const newPhoneId = await new Promise((resolve, reject) => {
      con.query(sql, [req.body.name, req.body.sale], function (err, result) {
        if (err) {
          console.log(err);
          reject({ stt: 500, err: "Lỗi truy vấn" });
          return;
        }
        resolve(result.insertId);
      });
    });
    const variants = req.body.variants;
    for (const variant of variants) {
      let newVariantId = null;
      newVariantId = await new Promise((resolve, reject) => {
        con.query(
          "insert into phone_variant values(default,?,?,?,?)",
          [newPhoneId, variant.color, variant.capacity, variant.quantity],
          function (err, result) {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Lỗi truy vấn" });
            }
            resolve(result.insertId);
          }
        );
      });
      for (const imgSrc of variant.imgSrcList) {
        await new Promise((resolve, reject) => {
          con.query(
            "insert into phone_variant_img values(?,?,default)",
            [newVariantId, imgSrc],
            (err) => {
              if (err) {
                console.log(err);
                return reject({ stt: 500, err: "Lỗi truy vấn" });
              }
              resolve();
            }
          );
        });
      }
      await new Promise((resolve, reject) => {
        con.query(
          "insert into phone_variant_price values(default,?,?,?)",
          [newVariantId, variant.price, new Date()],
          (err) => {
            if (err) {
              console.log(err);
              return reject({ stt: 500, err: "Lỗi truy vấn" });
            }
            resolve();
          }
        );
      });
    }
  } catch ({ err, stt }) {
    console.log(err);
    res.status(stt).send(err);
  }
  res.send("them thanh cong");
});

export default router;
