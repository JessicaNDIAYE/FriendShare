// src/routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const { validateUpdateProfile } = require('../middleware/validation');

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', [auth, validateUpdateProfile], async (req, res) => {
  try {
    const { username, avatar } = req.body;
    
    // Check if username already exists
    if (username) {
      const usernameExists = await User.findOne({ 
        username, 
        _id: { $ne: req.user.id } 
      });
      
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (avatar) updateData.avatar = avatar;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's friends
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friends', '-password -connections -friendRequests')
      .select('friends');
    
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search users
router.get('/search', auth, async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Search query is required' });
    
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: req.user.id }  // Exclude current user
    }).select('username email avatar');
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send friend request
router.post('/friends/request', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });
    
    // Check if user exists
    const recipient = await User.findById(userId);
    if (!recipient) return res.status(404).json({ message: 'User not found' });
    
    // Check if user is already a friend
    const currentUser = await User.findById(req.user.id);
    if (currentUser.friends.includes(userId)) {
      return res.status(400).json({ message: 'This user is already your friend' });
    }
    
    // Check if friend request already exists
    const requestExists = recipient.friendRequests.find(
      request => request.sender.toString() === req.user.id && request.status === 'pending'
    );
    
    if (requestExists) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }
    
    // Add friend request
    recipient.friendRequests.push({
      sender: req.user.id,
      status: 'pending'
    });
    
    await recipient.save();
    
    // Create notification
    const notification = new Notification({
      type: 'FRIEND_REQUEST',
      sender: req.user.id,
      recipient: userId,
      content: { userId: req.user.id }
    });
    
    await notification.save();
    
    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept/reject friend request
router.put('/friends/:action', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const { action } = req.params;
    
    if (!userId) return res.status(400).json({ message: 'User ID is required' });
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    
    // Find current user
    const currentUser = await User.findById(req.user.id);
    
    // Find friend request
    const requestIndex = currentUser.friendRequests.findIndex(
      request => request.sender.toString() === userId && request.status === 'pending'
    );
    
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    if (action === 'accept') {
      // Add to friends list (both users)
      currentUser.friends.push(userId);
      
      // Find sender and add current user to their friends
      const sender = await User.findById(userId);
      sender.friends.push(req.user.id);
      await sender.save();
      
      // Create notification
      const notification = new Notification({
        type: 'FRIEND_ACCEPTED',
        sender: req.user.id,
        recipient: userId,
        content: { userId: req.user.id }
      });
      
      await notification.save();
    }
    
    // Update request status
    currentUser.friendRequests[requestIndex].status = action === 'accept' ? 'accepted' : 'rejected';
    await currentUser.save();
    
    res.status(200).json({ 
      message: action === 'accept' ? 'Friend request accepted' : 'Friend request rejected' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove friend
router.delete('/friends/:id', auth, async (req, res) => {
  try {
    const friendId = req.params.id;
    
    // Update current user
    const currentUser = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { friends: friendId } },
      { new: true }
    );
    
    // Update friend
    await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: req.user.id } }
    );
    
    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connect music service
router.post('/connect/:service', auth, async (req, res) => {
  try {
    const { service } = req.params;
    const { authCode } = req.body;
    
    if (!['spotify', 'appleMusic', 'amazonMusic'].includes(service)) {
      return res.status(400).json({ message: 'Invalid service' });
    }
    
    if (!authCode) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }
    
    // Here you would implement the OAuth flow for each service
    // This is a simplified example
    let serviceData = {
      connected: true,
      accessToken: 'sample-token', // In a real app, you would get these from the OAuth provider
      expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
    };
    
    if (service === 'spotify' || service === 'amazonMusic') {
      serviceData.refreshToken = 'sample-refresh-token';
    }
    
    // Update user's connections
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { [`connections.${service}`]: serviceData } },
      { new: true }
    ).select('-password');
    
    res.status(200).json({ 
      message: `Connected to ${service} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Disconnect music service
router.post('/disconnect/:service', auth, async (req, res) => {
  try {
    const { service } = req.params;
    
    if (!['spotify', 'appleMusic', 'amazonMusic'].includes(service)) {
      return res.status(400).json({ message: 'Invalid service' });
    }
    
    // Reset connection data
    const resetData = {
      connected: false,
      accessToken: null,
      refreshToken: null,
      userId: null,
      expiresAt: null
    };
    
    // Update user's connections
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { [`connections.${service}`]: resetData } },
      { new: true }
    ).select('-password');
    
    res.status(200).json({ 
      message: `Disconnected from ${service} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;