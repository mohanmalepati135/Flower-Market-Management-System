

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-flower-market';
    

    
    const conn = await mongoose.connect(uri);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error(` MongoDB Error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('  MongoDB Disconnected');
    });
    
    return conn;
  } catch (error) {
    console.error(` MongoDB Connection Failed: ${error.message}`);
    // console.log('\n Solutions:');
    // console.log('   1. Create .env file with MONGODB_URI=mongodb://localhost:27017/smart-flower-market');
    // console.log('   2. Or install MongoDB locally');
    // console.log('   3. Or use MongoDB Atlas (cloud)');
    process.exit(1);
  }
};

module.exports = connectDB;

