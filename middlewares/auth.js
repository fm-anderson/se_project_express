const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } = require("../utils/error");

const handleAuthError = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR.error)
      .send({ message: "Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res
        .status(UNAUTHORIZED_ERROR.error)
        .send({ message: "Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
      return res
        .status(UNAUTHORIZED_ERROR.error)
        .send({ message: "Token expired" });
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
