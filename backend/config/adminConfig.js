// backend/config/adminConfig.js
// Hardcoded admin credentials for university login

module.exports = {
  admin: {
    name: 'Galgotias University Admin',
    email: 'admin@galgotiasuniversity.edu.in',
    password: 'Admin@2025', // This will be compared using bcrypt
    role: 'University',
    _id: 'admin-university-account' // Special ID for admin
  }
};

// NOTE: In production, store the hashed password here instead of plain text
// For now, the password will be hashed on first comparison in loginUser