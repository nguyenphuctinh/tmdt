import express from "express";
import con from "../../../config/connection.js";
import authenToken from "../../middlewares/authenToken.js";
const router = express.Router();
router.get("/", authenToken, (req, res) => {
  console.log("phone");
  con.query("SELECT * FROM phone", function (err, result) {
    if (err) return res.send("Error");
    res.send(result);
  });
});
router.post("/", async (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

export default router;
