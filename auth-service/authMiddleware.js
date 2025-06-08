const jwt = require('jsonwebtoken');
require('dotenv').config();


const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });

  const token = auth.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET); // Make sure this matches login
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verify failed:', err.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
