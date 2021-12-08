const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("test deploy nodejs NGuyễn Phsuc Tĩnh");
});
app.listen(3000);
