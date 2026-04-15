const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');


// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, sizes, base64Image } = req.body;

  // Handle uploaded images (Multer)
  let images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  // Handle Base64 image upload (Alternative)
  if (base64Image) {
    try {
      // Data format: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      const parts = base64Image.split(';base64,');
      const format = parts[0].split('/')[1] || 'jpeg';
      const imageData = parts[1];
      const filename = `b64-${Date.now()}.${format}`;
      const filepath = path.join(__dirname, '../../uploads', filename);
      
      fs.writeFileSync(filepath, imageData, { encoding: 'base64' });
      images.push(`/uploads/${filename}`);
    } catch (error) {
      console.error('Base64 image decoding failed:', error);
      // Continue without the base64 image if it fails
    }
  }

  const parseSizes = (sizes) => {
    if (!sizes || sizes === '' || sizes === 'null' || sizes === 'undefined') return [];
    if (Array.isArray(sizes)) return sizes;
    // Handle comma-separated string: "S,M,L"
    const sizesStr = String(sizes);
    return sizesStr.split(',').map(s => s.trim()).filter(Boolean);
  };

  const product = new Product({
    name,
    description,
    price,
    category,
    stock,
    sizes: parseSizes(sizes),
    images,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, sizes } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    if (sizes !== undefined && sizes !== null) {
      const sizesStr = String(sizes || '');
      product.sizes = sizesStr === '' || sizesStr === 'null' 
        ? [] 
        : sizesStr.split(',').map(s => s.trim()).filter(Boolean);
    }

    // If new images are uploaded, add them
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
