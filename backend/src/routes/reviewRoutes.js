const express = require('express');
const router = express.Router();
const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addReview);
router.get('/:productId', getProductReviews); // Public
router.put('/update/:id', protect, updateReview);
router.delete('/delete/:id', protect, deleteReview);

module.exports = router;
