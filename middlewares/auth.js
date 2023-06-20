const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { FORBIDDEN_ERROR } = require("../utils/error");

const handleAuthError = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Token expired" });
    }
    return res.status(FORBIDDEN_ERROR.error).send({ message: "Bad request" });
  }

  req.user = payload;

  next();

  return null;
};

module.exports = {
  handleAuthError,
};
