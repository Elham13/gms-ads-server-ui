const express = require('express');
const router = express.Router();

// Inline controller logic
router.get('/', (req, res) => {
  const upiNumbers = [
    '9876543210@upi',
    '1234567890@axis',
    '9876501234@okhdfcbank',
    '9090909090@paytm'
  ];
  res.json(upiNumbers);
});

module.exports = router;
