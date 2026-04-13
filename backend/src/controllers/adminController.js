const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();
  const reviewsCount = await Review.countDocuments();

  // Calculate total revenue
  const orders = await Order.find({ isPaid: true });
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  res.json({
    usersCount,
    productsCount,
    ordersCount,
    reviewsCount,
    totalRevenue,
  });
});

// @desc    Get all users (for admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get all orders (for admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name');
  res.json(orders);
});

// @desc    Get all reviews (for admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({}).populate('user', 'name').populate('product', 'name');
  res.json(reviews);
});

module.exports = {
  getStats,
  getAllUsers,
  getAllOrders,
  getAllReviews,
};
