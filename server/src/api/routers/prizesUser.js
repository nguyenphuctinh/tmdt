import express from "express";
import con from "../../config/connection.js";
import authenToken from "../middlewares/authenToken.js";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const newPrizeUser = await new Promise((resolve, reject) => {
      const stm = "insert into prize_user values(default, ?, ?)";
      con.query(stm, [req.body.prizeId, req.body.userId], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ err: "Loi Sql" });
        }
        resolve({
          prizeId: result.insertId,
          prizeName: req.body.prizeName,
        });
      });
    });
    // console.log(result);
    res.send(newPrizeUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.get("/:id", authenToken, async (req, res) => {
  try {
    const prizeUser = await new Promise((resolve, reject) => {
      const stm = `SELECT prize_user_id as prizeUserId, prize.prize_id as prizeId, user_id as userId, prize_name as prizeName  FROM prize_user join prize
on prize.prize_id=prize_user.prize_id where user_id=?`;
      con.query(stm, [req.params.id], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ err: "Loi Sql" });
        }
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    res.send(prizeUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
export default router;
