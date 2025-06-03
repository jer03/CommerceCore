const express = require('express');
const app = express();
app.use(express.json());

app.post('/pay', (req, res) => {
  const { order_id, amount } = req.body;
  console.log(`Charging $${amount} for order ${order_id}...`);
  res.send({ status: "PAID", order_id });
});

app.listen(7000, () => console.log("Payment service running on port 7000"));
