const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keyValues");
const mongoose = require("mongoose");

const User = mongoose.model("User");
module.exports = (req, res, next) => {
  const authorization = req.headers["authorization"];
  console.log("authorization", authorization);
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in 1" });
  }

  const token = authorization && authorization.split(" ")[1];
  // const token =
  //   authorization && authorization.toString().replace("Bearer ", "");
  console.log("token", token);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in 2" });
    }
    const { id } = payload;
    User.findById(id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
