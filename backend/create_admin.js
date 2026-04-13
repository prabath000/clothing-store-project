const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminEmail = 'admin@example.com';
    const adminPassword = 'adminpassword123';
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (adminExists) {
      console.log('Admin user already exists.');
      // Update role to admin just in case it was changed
      adminExists.role = 'admin';
      await adminExists.save();
      console.log('Admin role ensured.');
    } else {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Admin user created successfully!');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
    }
    
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
