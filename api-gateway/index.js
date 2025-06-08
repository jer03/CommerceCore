const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const authService = 'http://auth-service:4000';
const productService = 'http://product-service:5000';
const orderService = 'http://order-service:6000';

// Auth routes
app.use('/signup', createProxyMiddleware({ target: authService, changeOrigin: true }));
app.use('/login', createProxyMiddleware({ target: authService, changeOrigin: true }));

// Product routes
app.use('/products', createProxyMiddleware({ target: productService, changeOrigin: true }));

// Order routes
app.use('/orders', createProxyMiddleware({ target: orderService, changeOrigin: true }));

app.listen(8080, () => console.log('API Gateway running on port 8080'));
