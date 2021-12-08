const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("test deploy nodejs NGuyễn Phsuc Tĩnh");
});
app.get("/user", (req, res) => {
  res.json([
    { name: "Tĩnh", age: 20 },
    { name: "Việt Anh", age: 20 },
    { name: "Huyền Anh", age: 18 },
  ]);
});
const port = process.env.PORT || 3000;
app.listen(port);
