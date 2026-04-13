const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', protect, addOrderItems);
router.get('/:userId', protect, getMyOrders);
router.get('/order/:id', protect, getOrderById);
router.put('/update/:id', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
