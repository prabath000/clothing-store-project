const express = require('express');
const router = express.Router();
const {
  createPayment,
  getUserPayments,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createPayment);
router.get('/:userId', protect, getUserPayments);

module.exports = router;
