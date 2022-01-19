import jwt from "jsonwebtoken";
import express from "express";
import con from "./connection.js";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user.js";
import authenToken from "./auth/auth.js";
dotenv.config();
const app = express();
app.use(cors()); // cho phép client access
app.use(express.json()); // for parsing application/json
app.use(
  express.urlencoded({
    extended: true,
  })
); // for parsing application/x-www-form-urlencoded

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.post("/login", (req, res) => {
  const stm = "SELECT * FROM user where username=? and password=?";
  con.query(stm, [req.body.username, req.body.password], function (err, data) {
    if (err || data.length == 0)
      return res.status(422).send("Tai khoan hoac mat khau khong dung");
    // console.log({ ...req.body, role: data[0].role });
    const accessToken = jwt.sign(
      { ...req.body, role: data[0].role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "300000s",
      }
    );
    res.status(200).json({ accessToken, message: "Đăng nhập thành công!" });
  });
});

app.get("/auth", authenToken, (req, res) => {
  // console.log(req.role);
  res.json({ username: req.username, role: req.role });
});

app.use("/api/users", userRouter);
const port = process.env.PORT || 8080;

app.listen(port);
