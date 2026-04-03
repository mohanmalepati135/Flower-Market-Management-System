

const mongoose = require('mongoose');
const User = require('../models/User');
const Flower = require('../models/Flower');


require('dotenv').config();

// Fallback connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-flower-market';

const connectDB = async () => {
  try {
    console.log('Connecting to:', MONGODB_URI);
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(` MongoDB Error: ${error.message}`);
    console.log('\n Fix: Create .env file with MONGODB_URI=mongodb://localhost:27017/smart-flower-market');
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    
    await User.deleteMany({});
    await Flower.deleteMany({});
    console.log('  Cleared old data');

    // Create demo users
    const users = [
      {
        email: 'admin@market.com',
        password: 'admin123',
        fullName: 'Administrator',
        phone: '9999999999',
        role: 'ADMIN',
        status: 'ACTIVE',
        preferredChannel: 'WHATSAPP'
      },
      {
        email: 'rajesh@trader.com',
        password: 'buyer123',
        fullName: 'Rajesh Traders',
        phone: '9876543210',
        role: 'BUYER',
        status: 'ACTIVE',
        preferredChannel: 'WHATSAPP'
      },
      {
        email: 'amit@floral.com',
        password: 'buyer123',
        fullName: 'Amit Floral',
        phone: '9876543211',
        role: 'BUYER',
        status: 'ACTIVE',
        preferredChannel: 'SMS'
      },
      {
        email: 'ram@farm.com',
        password: 'farmer123',
        fullName: 'Ram Singh',
        phone: '9123456789',
        role: 'FARMER',
        status: 'ACTIVE',
        preferredChannel: 'WHATSAPP'
      },
      {
        email: 'sita@roses.com',
        password: 'farmer123',
        fullName: 'Sita Roses',
        phone: '9234567890',
        role: 'FARMER',
        status: 'ACTIVE',
        preferredChannel: 'WHATSAPP'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(` Created user: ${user.fullName} (${user.role})`);
    }

    // Create demo flowers
    const flowers = [
      { name: 'Premium Red Rose', basePrice: 0 },
      { name: 'White Jasmine', basePrice: 0 },
      { name: 'Marigold', basePrice: 0 }
    ];

    for (const flowerData of flowers) {
      const flower = new Flower(flowerData);
      await flower.save();
      console.log(` Created flower: ${flower.name}`);
    }

    console.log('\n Seed data created successfully!');
    console.log('\n Demo Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:   admin@market.com / admin123');
    console.log('Buyer:   rajesh@trader.com / buyer123');
    console.log('Farmer:  ram@farm.com / farmer123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error(' Error:', error.message);
    process.exit(1);
  }
};

seedData();