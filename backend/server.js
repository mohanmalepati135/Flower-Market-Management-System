


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env first
dotenv.config();

const connectDB = require('./config/db');

// Check required env vars
if (!process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI not set, using default: mongodb://localhost:27017/smart-flower-market');
}

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const flowerRoutes = require('./routes/flowers');
const transactionRoutes = require('./routes/transactions');

// Mount routes - ORDER MATTERS! Specific routes before general ones
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);  // This must come before any other /api/users/* 
app.use('/api/flowers', flowerRoutes);
app.use('/api/transactions', transactionRoutes);

// Debug: Log all registered routes
console.log('Registered routes:');
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`  ${Object.keys(r.route.methods)} ${r.route.path}`);
  } else if (r.name === 'router') {
    console.log(`  Router: ${r.regexp}`);
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API Base: http://localhost:${PORT}/api`);
});