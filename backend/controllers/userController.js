// backend/controllers/userController.js - WITH ADMIN LOGIN
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminConfig = require('../config/adminConfig');

// @desc    Register a new user (Student or Company only)
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1. Check if all fields are present
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // 2. Prevent University registration through API
  if (role === 'University') {
    return res.status(403).json({ message: 'University accounts cannot be created through registration. Please contact system administrator.' });
  }

  // 3. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // 4. Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. Create and save the new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'Student', // Default to Student if not provided
  });

  if (user) {
    // 6. Respond with user data and a token
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate (login) a user or admin
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // CHECK IF ADMIN LOGIN
  if (email === adminConfig.admin.email) {
    // Admin login attempt
    if (password === adminConfig.admin.password) {
      // Admin credentials match
      return res.json({
        _id: adminConfig.admin._id,
        name: adminConfig.admin.name,
        email: adminConfig.admin.email,
        role: adminConfig.admin.role,
        token: generateToken(adminConfig.admin._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
  }

  // REGULAR USER LOGIN
  // 1. Find the user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists and if password matches
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

module.exports = {
  registerUser,
  loginUser,
};