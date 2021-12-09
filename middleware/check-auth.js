require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.send({
      status: 404,
      message: "No Token Provided",
    });
  }
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userInfo = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.send({
      status: 401,
      message: "Could not Authentication",
    });
  }
};
