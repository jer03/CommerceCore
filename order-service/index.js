const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());

const axios = require('axios');
const authMiddleware = require('./authMiddleware');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const init = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_email TEXT,
      product_id INTEGER,
      quantity INTEGER,
      status TEXT DEFAULT 'PENDING'
    );
  `);
};
init();

const jwt = require('jsonwebtoken');

app.post('/orders', authMiddleware, async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_email = req.user.email; // From JWT
  
    try {
      // 🔁 Fetch product info from product-service
      const productResponse = await axios.get(`http://product-service:5000/products/${product_id}`);
      const product = productResponse.data;
      const price = product.price;
  
      const total_price = price * quantity;
  
      // Insert new order
      const insertResult = await db.query(
        'INSERT INTO orders (user_email, product_id, quantity) VALUES ($1, $2, $3) RETURNING id',
        [user_email, product_id, quantity]
      );
  
      const orderId = insertResult.rows[0].id;
  
      // Send payment request
      const response = await fetch('http://payment-service:7000/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, amount: total_price }),
      });
  
      const result = await response.json();
      if (result.status === "PAID") {
        await db.query('UPDATE orders SET status = $1 WHERE id = $2', ['PAID', orderId]);
      }
  
      res.json({ order_id: orderId, payment_status: result.status });
    } catch (err) {
      console.error("Order creation failed", err);
      res.status(500).send("Order failed");
    }
  });  
  

app.get('/orders', async (req, res) => {
  const result = await db.query('SELECT * FROM orders');
  res.json(result.rows);
});

app.listen(6000, () => console.log("Order service running on port 6000"));
