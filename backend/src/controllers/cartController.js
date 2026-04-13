const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      cartItems: [{ product: productId, quantity }],
    });
  } else {
    // Check if product already exists in cart
    const itemIndex = cart.cartItems.findIndex(i => i.product.toString() === productId);

    if (itemIndex > -1) {
      // Update quantity
      cart.cartItems[itemIndex].quantity += Number(quantity);
    } else {
      // Add new item
      cart.cartItems.push({ product: productId, quantity });
    }
  }

  const savedCart = await cart.save();
  res.status(201).json(savedCart);
});

// @desc    Get user cart
// @route   GET /api/cart/:userId
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId }).populate('cartItems.product');

  if (cart) {
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart empty or not found');
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const itemIndex = cart.cartItems.findIndex(i => i._id.toString() === req.params.id);

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.cartItems = cart.cartItems.filter(i => i._id.toString() !== req.params.id);
    await cart.save();
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

module.exports = {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
};
