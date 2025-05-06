// src/routes/auth.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Register
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Check if email already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).json({ message: 'Email already exists' });

    // Check if username already exists
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) return res.status(400).json({ message: 'Username already exists' });

    // Create new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    // Save user to database
    const savedUser = await user.save();

    // Generate tokens
    const token = savedUser.generateAuthToken();
    const refreshToken = savedUser.generateRefreshToken();

    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'Email or password is incorrect' });

    // Check if password is correct
    const validPassword = await user.comparePassword(req.body.password);
    if (!validPassword) return res.status(400).json({ message: 'Email or password is incorrect' });

    // Generate tokens
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: 'Logged in successfully',
      user: userResponse,
      token,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' });

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    // Generate new access token
    const token = user.generateAuthToken();

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  // In a real application, you would invalidate the token here
  // For JWT, you could add the token to a blacklist or use a short-lived token strategy
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;