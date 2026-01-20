const express = require('express');
const router = express.Router();
const { createPaymentIntent, getPaymentHistory, recordPayment, getAllPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/record', protect, recordPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/all', protect, getAllPayments); // Admin use

module.exports = router;
