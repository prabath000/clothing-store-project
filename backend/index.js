const dotenv = require('dotenv');
dotenv.config(); // MUST be first before anything else

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
}));

// Body parser (must be before routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Make uploads folder static
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root - heartbeat
app.get('/', (req, res) => res.send('Clothing Store API is Live ✅'));

// Health check route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    status: 'success',
    message: 'Clothing Store API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatusMap[dbStatus] || 'unknown',
      readyState: dbStatus
    },
    uptime: process.uptime()
  });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local:            http://localhost:${PORT}`);
    console.log(`Emulator/Network: http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;
