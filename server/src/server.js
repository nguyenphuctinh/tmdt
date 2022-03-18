import jwt from "jsonwebtoken";
import express from "express";
import con from "./config/connection.js";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./api/routers/user.js";
import productRouter from "./api/routers/product.js";
import webhookRouter from "./api/routers/webhook.js";
import authenToken from "./api/middlewares/authenToken.js";
import passwordHash from "password-hash";
dotenv.config();
const app = express();
app.use(cors()); // cho phép client access
app.use(express.json()); // for parsing application/json
app.use(
  express.urlencoded({
    extended: true,
  })
); // for parsing application/x-www-form -urlencoded

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.post("/login", async (req, res) => {
  // console.log(passwordHash.verify("password123", hashedPassword));
  try {
    const user = await new Promise((resolve, reject) => {
      const stm = "SELECT * FROM user where username=?";
      con.query(stm, [req.body.username], function (err, result) {
        if (err) {
          console.log(err);
          reject({ stt: 500, err: "SQL error" });
        }
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
    if (user.length === 0) {
      return res
        .status(401)
        .json({ message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }

    if (passwordHash.verify(req.body.password, user[0].password)) {
      const accessToken = jwt.sign(
        { ...req.body, role: user[0].role },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.status(200).json({ accessToken, message: "Đăng nhập thành công!" });

      console.log("ok");
      return;
    }
    res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.get("/auth", authenToken, (req, res) => {
  // console.log(req.role);
  res.json({ username: req.username, role: req.role });
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/webhook", webhookRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
