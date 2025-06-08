require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
    const token = authHeader.split(' ')[1];
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET); // Use the same secret as in auth-service
      req.user = user;
      next();
    } catch (err) {
      res.status(403).json({ error: 'Invalid token' });
    }
  };
  
  module.exports = authMiddleware;