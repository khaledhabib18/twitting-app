const jwt = require("jsonwebtoken");

const check = (secret) => {
  return (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      next();
    });
  };
};

module.exports = check;
