// src/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Add user to request
    req.user = { id: user._id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// src/middleware/validation.js

const Joi = require('joi');

// Validate registration request
const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  next();
};

// Validate login request
const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  next();
};

// Validate profile update request
const validateUpdateProfile = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30),
    avatar: Joi.string().uri()
  }).min(1); // At least one field is required
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  next();
};

// Validate playlist request
const validatePlaylist = (req, res, next) => {
  const songSchema = Joi.object({
    title: Joi.string().required(),
    artist: Joi.string().required(),
    album: Joi.string(),
    duration: Joi.number(),
    spotifyId: Joi.string(),
    appleMusicId: Joi.string(),
    amazonMusicId: Joi.string(),
    deezerId: Joi.string(),
    youtubeId: Joi.string(),
    coverImage: Joi.string().uri()
  });
  
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    coverImage: Joi.string().uri(),
    songs: Joi.array().items(songSchema),
    isPublic: Joi.boolean(),
    sourceService: Joi.string().valid('spotify', 'appleMusic', 'amazonMusic', 'deezer', 'youtube', 'custom'),
    originalId: Joi.string()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateUpdateProfile,
  validatePlaylist
};