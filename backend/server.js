// server.js - FIXED WITH CORS
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

// Connect to the database
connectDB();

const app = express();

// CORS Configuration - IMPORTANT!
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React frontend
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'CertiChain API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ MongoDB connected`);
});