// backend/middleware/authMiddleware.js - WITH ADMIN SUPPORT
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const adminConfig = require('../config/adminConfig');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // CHECK IF ADMIN
      if (decoded.id === adminConfig.admin._id) {
        // Admin user
        req.user = {
          _id: adminConfig.admin._id,
          name: adminConfig.admin.name,
          email: adminConfig.admin.email,
          role: adminConfig.admin.role
        };
        return next();
      }

      // REGULAR USER - Get user from the token (and exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to authorize based on role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'User role not found' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };