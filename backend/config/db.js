// config/db.js - ENHANCED CONNECTION WITH BETTER ERROR HANDLING
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set mongoose options for better connectivity
    mongoose.set('strictQuery', false);
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 75000, // 75 seconds
      family: 4, // Force IPv4 (sometimes IPv6 causes issues)
      retryWrites: true,
      w: 'majority',
    };

    console.log('🔄 Attempting MongoDB connection...');
    console.log(`📍 Connection String: ${process.env.MONGO_URI.replace(/\/\/(.+):(.+)@/, '//*****:*****@')}`);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection FAILED');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`Error: ${error.message}`);
    console.error('');
    console.error('🔍 TROUBLESHOOTING STEPS:');
    console.error('1. Check if MongoDB is running (local) or Atlas IP is whitelisted');
    console.error('2. Verify connection string in .env file');
    console.error('3. Check if port 27017 is blocked by firewall');
    console.error('4. Try using a VPN if Atlas connection fails');
    console.error('5. Consider using local MongoDB for development');
    console.error('');
    console.error('💡 Quick Fix: Use local MongoDB');
    console.error('   MONGO_URI=mongodb://127.0.0.1:27017/certichain');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(1);
  }

  // Connection event handlers
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err.message);
  });
};

module.exports = connectDB;