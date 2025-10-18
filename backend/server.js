// server.js
const dotenv = require('dotenv');
// MOVE THIS TO THE VERY TOP
dotenv.config();

const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

// Connect to the database
connectDB();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});