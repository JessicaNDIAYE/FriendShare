// backend/utils/jwtUtils.js
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' });
};

module.exports = { generateToken };
