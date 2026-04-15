const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI environment variable is missing!');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000, // Timeout after 20s instead of default
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferCommands: false, // Disable buffering so we get immediate errors if DB is down
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection loss after initial connect
    mongoose.connection.on('error', err => {
      console.error('Mongoose connection error:', err);
    });
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Do not call process.exit(1) on Vercel as it crashes the function
  }
};

module.exports = connectDB;
