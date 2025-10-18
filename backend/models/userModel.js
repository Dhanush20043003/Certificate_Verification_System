// models/userModel.js
const mongoose = require('mongoose');

// models/userModel.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['University', 'Student', 'Company'], // UPDATED ROLES
    default: 'Student', // UPDATED DEFAULT
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);
module.exports = User;