const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      msg: "Token Dosen't Exist",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({
        msg: "Invalid Credentials",
      });
    }
  } catch (err) {
    return res.status(403).json({
      msg: "Internal server Error",
    });
  }
};

module.exports = {
  authMiddleware,
};
