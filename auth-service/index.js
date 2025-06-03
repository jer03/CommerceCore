const express = require('express');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const init = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
};
init();


// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401); // No Authorization header

  const token = auth.split(' ')[1]; // Expected format: Bearer <token>
  try {
    const user = jwt.verify(token, 'your_jwt_secret'); // Use same secret as in login
    req.user = user; // attach user info to request
    next(); // continue to route
  } catch {
    res.sendStatus(403); // Invalid or expired token
  }
};

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hash]);
  res.send({ message: "User created." });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await db.query('SELECT * FROM users WHERE email=$1', [email]);
  if (result.rows.length === 0) return res.status(401).send("User not found");

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send("Wrong password");

  const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret');
  res.json({ token });
});

app.listen(4000, () => console.log("Auth service running on port 4000"));
