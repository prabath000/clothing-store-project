const mongoose = require('mongoose');

// Use a global variable to cache the database connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI environment variable is missing!');
    return;
  }

  console.log('=> Connecting to database...');
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout faster on Vercel (5s) to avoid generic 502
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    
    isConnected = conn.connections[0].readyState === 1;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection loss
    mongoose.connection.on('error', err => {
      console.error('Mongoose connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('=> MongoDB Disconnected');
      isConnected = false;
    });

  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    isConnected = false;
  }
};

module.exports = connectDB;

