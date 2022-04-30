import express from "express";
import con from "../../config/connection.js";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const newPrize = await new Promise((resolve, reject) => {
      const stm = "insert into prize values(default, ?)";
      con.query(stm, [req.body.prizeName], (err, result) => {
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
    res.send(newPrize);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stm =
        "select prize_id as prizeId, prize_name as prizeName from prize";
      con.query(stm, (err, result) => {
        if (err) {
          console.log(err);
          return reject({ err: "Loi Sql" });
        }
        resolve(result);
      });
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      const stm = "delete from prize where prize_id=?";
      con.query(stm, [req.params.id], (err, result) => {
        if (err) {
          console.log(err);
          return reject({ err: "Loi Sql" });
        }
        resolve();
      });
    });
    res.send("Thanh cong");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
export default router;
