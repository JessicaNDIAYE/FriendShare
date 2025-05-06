// backend/routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'This is a protected route' });
});

module.exports = router;
