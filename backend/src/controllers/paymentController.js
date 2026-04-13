const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Create payment flow (Mock)
// @route   POST /api/payments/create
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod, amount } = req.body;

  const order = await Order.findById(orderId);

  if (order) {
    // Generate a mock transaction ID
    const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const payment = await Payment.create({
      user: req.user._id,
      order: orderId,
      paymentMethod,
      amount,
      status: 'Completed',
      transactionId,
    });

    // Update order status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: transactionId,
      status: 'Completed',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    await order.save();

    res.status(201).json(payment);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get user payments
// @route   GET /api/payments/:userId
// @access  Private
const getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.params.userId }).populate('order');
  res.json(payments);
});

module.exports = {
  createPayment,
  getUserPayments,
};
