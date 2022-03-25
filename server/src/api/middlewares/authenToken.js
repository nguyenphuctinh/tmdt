import jwt from "jsonwebtoken";

function authenToken(req, res, next) {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) res.status(400).send("req ko có header auth");
  else {
    const token = authorizationHeader.split(" ")[1];
    if (!token) res.status(401).send("!token");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) {
        res.status(403).send("invalid token");
      } else {
        req.body.username = data.username;
        next();
      }
    });
  }
}
export default authenToken;
