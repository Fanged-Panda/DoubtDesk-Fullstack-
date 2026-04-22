const express = require('express');
const paymentService = require('../services/paymentService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await paymentService.createPayment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
