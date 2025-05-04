// backend/routes/checkClient.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // adjust path if needed

router.get('/check-client', async (req, res) => {
  const { phone } = req.query;
  try {
    const existingClient = await Order.findOne({ phone });
    if (existingClient) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking client:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
