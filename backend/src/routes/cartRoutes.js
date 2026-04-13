const express = require('express');
const router = express.Router();
const {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addToCart);
router.get('/:userId', protect, getUserCart);
router.put('/update/:id', protect, updateCartItem);
router.delete('/remove/:id', protect, removeFromCart);

module.exports = router;
