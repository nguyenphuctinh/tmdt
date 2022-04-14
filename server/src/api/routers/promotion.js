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
    res.send(rows[0]);
    console.log(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Loi Server",
      error: error,
    });
  }
});
router.post("/", async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      const stm = "insert into promotion values(default,?,?,?)";
      con.query(
        stm,
        ["sale tet", new Date(), addDays(new Date(), 2)],
        (err, result) => {
          if (err) {
            console.log(err);
            return reject({ err: "Loi Sql" });
          }
          resolve();
        }
      );
    });
    res.send("ok");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Loi Server",
      error: error,
    });
  }
});
export default router;
