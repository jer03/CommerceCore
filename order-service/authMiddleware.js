const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  console.log("Incoming auth header:", auth);

  if (!auth) return res.status(401).json({ error: "Missing Authorization header" });

  const token = auth.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified in middleware:", user);
    req.user = user;
    next();
  } catch (err) {
    console.error(" JWT error:", err.message);
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
