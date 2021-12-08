const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("test deploy nodejs NGuyễn Phsuc Tĩnh");
});
const port = process.env.PORT || 3000;
app.listen(port);
