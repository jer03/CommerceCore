const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());

const authMiddleware = require('./authMiddleware');

const init = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC NOT NULL
    );
  `);
};
init();

const jwt = require('jsonwebtoken');

app.post('/products', authMiddleware, async (req, res) => {
  const { name, price } = req.body;
  await db.query('INSERT INTO products (name, price) VALUES ($1, $2)', [name, price]);
  res.send({ message: "Product added." });
});

app.get('/products', async (req, res) => {
  const result = await db.query('SELECT * FROM products');
  res.json(result.rows);
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send("Product not found");
    res.json(result.rows[0]);
  });
  

app.listen(5000, () => console.log("Product service running on port 5000"));
