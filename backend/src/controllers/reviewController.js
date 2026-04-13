const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

// Helper function to update product rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  
  const numReviews = reviews.length;
  const averageRating = numReviews > 0 
    ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews 
    : 0;

  await Product.findByIdAndUpdate(productId, {
    numReviews,
    averageRating: Number(averageRating.toFixed(1)),
  });
};

// @desc    Add a review
// @route   POST /api/reviews/add
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = await Review.create({
    user: req.user._id,
    name: req.user.name,
    product: productId,
    rating: Number(rating),
    comment,
  });

  await updateProductRating(productId);

  res.status(201).json(review);
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.json(reviews);
});

// @desc    Update a review
// @route   PUT /api/reviews/update/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.findById(req.params.id);

  if (review) {
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this review');
    }

    review.rating = Number(rating) || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    await updateProductRating(review.product);

    res.json(updatedReview);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/delete/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this review');
    }

    const productId = review.product;
    await review.deleteOne();
    await updateProductRating(productId);

    res.json({ message: 'Review removed' });
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

module.exports = {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
};
