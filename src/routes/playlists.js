// src/routes/playlists.js

const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const { validatePlaylist } = require('../middleware/validation');

// Get all playlists created by the user
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ creator: req.user.id })
      .populate('creator', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all playlists shared with the user
router.get('/shared', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ sharedWith: req.user.id })
      .populate('creator', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific playlist
router.get('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('creator', 'username avatar')
      .populate('sharedWith', 'username avatar');
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if user has access to this playlist
    if (playlist.creator._id.toString() !== req.user.id && 
        !playlist.sharedWith.some(user => user._id.toString() === req.user.id) &&
        !playlist.isPublic) {
      return res.status(403).json({ message: 'You do not have access to this playlist' });
    }
    
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new playlist
router.post('/', [auth, validatePlaylist], async (req, res) => {
  try {
    const { name, description, coverImage, songs, isPublic, sourceService, originalId } = req.body;
    
    const playlist = new Playlist({
      name,
      description,
      coverImage: coverImage || 'https://via.placeholder.com/300',
      creator: req.user.id,
      songs: songs || [],
      isPublic: isPublic || false,
      sourceService: sourceService || 'custom',
      originalId
    });
    
    const savedPlaylist = await playlist.save();
    
    // Populate creator info
    await savedPlaylist.populate('creator', 'username avatar').execPopulate();
    
    res.status(201).json(savedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a playlist
router.put('/:id', [auth, validatePlaylist], async (req, res) => {
  try {
    const { name, description, coverImage, songs, isPublic } = req.body;
    
    // Find playlist
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if user is the creator
    if (playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own playlists' });
    }
    
    // Update fields
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description; // Allow empty description
    if (coverImage) playlist.coverImage = coverImage;
    if (songs) playlist.songs = songs;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    
    const updatedPlaylist = await playlist.save();
    
    // Populate creator and shared users
    await updatedPlaylist
      .populate('creator', 'username avatar')
      .populate('sharedWith', 'username avatar')
      .execPopulate();
    
    // Notify shared users if they exist
    if (updatedPlaylist.sharedWith.length > 0) {
      const notifications = updatedPlaylist.sharedWith.map(user => ({
        type: 'PLAYLIST_UPDATED',
        sender: req.user.id,
        recipient: user._id,
        content: { playlistId: updatedPlaylist._id, playlistName: updatedPlaylist.name }
      }));
      
      await Notification.insertMany(notifications);
    }
    
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a playlist
router.delete('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if user is the creator
    if (playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own playlists' });
    }
    
    await playlist.remove();
    
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Share a playlist with users
router.post('/:id/share', auth, async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs are required' });
    }
    
    // Find playlist
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if user is the creator
    if (playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only share your own playlists' });
    }
    
    // Filter out users that already have access and validate users exist
    const validUserIds = [];
    for (const userId of userIds) {
      // Skip if already shared with this user
      if (playlist.sharedWith.includes(userId)) continue;
      
      // Check if user exists
      const userExists = await User.exists({ _id: userId });
      if (userExists) validUserIds.push(userId);
    }
    
    if (validUserIds.length === 0) {
      return res.status(400).json({ message: 'No valid users to share with' });
    }
    
    // Add users to sharedWith array
    playlist.sharedWith.push(...validUserIds);
    const updatedPlaylist = await playlist.save();
    
    // Create notifications for each user
    const notifications = validUserIds.map(userId => ({
      type: 'PLAYLIST_SHARED',
      sender: req.user.id,
      recipient: userId,
      content: { playlistId: playlist._id, playlistName: playlist.name }
    }));
    
    await Notification.insertMany(notifications);
    
    // Populate user info
    await updatedPlaylist
      .populate('creator', 'username avatar')
      .populate('sharedWith', 'username avatar')
      .execPopulate();
    
    res.status(200).json({
      message: 'Playlist shared successfully',
      playlist: updatedPlaylist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export playlist to a music service
router.post('/:id/export', auth, async (req, res) => {
  try {
    const { service } = req.body;
    
    if (!['spotify', 'appleMusic', 'amazonMusic'].includes(service)) {
      return res.status(400).json({ message: 'Invalid service' });
    }
    
    // Find playlist
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if user has access to this playlist
    if (playlist.creator.toString() !== req.user.id && 
        !playlist.sharedWith.includes(req.user.id)) {
      return res.status(403).json({ message: 'You do not have access to this playlist' });
    }
    
    // Check if user is connected to the service
    const user = await User.findById(req.user.id);
    if (!user.connections[service] || !user.connections[service].connected) {
      return res.status(400).json({ 
        message: `You need to connect your ${service} account first` 
      });
    }
    
    // Here you would implement the actual export to the service
    // This would involve using the service's API to create a playlist
    // For this example, we'll just return a success message
    
    // Create notification for the playlist creator if it's not the current user
    if (playlist.creator.toString() !== req.user.id) {
      const notification = new Notification({
        type: 'PLAYLIST_EXPORTED',
        sender: req.user.id,
        recipient: playlist.creator,
        content: { 
          playlistId: playlist._id, 
          playlistName: playlist.name,
          service 
        }
      });
      
      await notification.save();
    }
    
    res.status(200).json({ 
      message: `Playlist exported to ${service} successfully`,
      // In a real app, you would return the ID of the newly created playlist on the service
      servicePlaylistId: 'mock-playlist-id-on-service'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;