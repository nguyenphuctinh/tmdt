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
    res.send({
      promotionId: rows[0].promotion_id,
      promotionName: rows[0].promotion_name,
      promotionStartTime: rows[0].promotion_start_time,
      promotionExpTime: rows[0].promotion_exp_time,
    });
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
  try {
    await new Promise((resolve, reject) => {
      const stm = "insert into promotion values(default,?,?,?,'tmp')";
      con.query(
        stm,
        ["sale tet", addDays(new Date(), 2), addDays(new Date(), 4)],
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
