const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addToWishlist);
router.get('/:userId', protect, getUserWishlist);
router.delete('/remove/:id', protect, removeFromWishlist);

module.exports = router;
