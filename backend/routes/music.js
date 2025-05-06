// src/routes/music.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Playlist = require('../models/Playlist');

// Search for songs across services
router.get('/search', auth, async (req, res) => {
  try {
    const { q, service } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    if (!service || !['spotify', 'appleMusic', 'amazonMusic', 'all'].includes(service)) {
      return res.status(400).json({ message: 'Valid service is required' });
    }
    
    // Check if user is connected to the requested service
    const user = await User.findById(req.user.id);
    
    if (service !== 'all') {
      if (!user.connections[service] || !user.connections[service].connected) {
        return res.status(400).json({ 
          message: `You need to connect your ${service} account first` 
        });
      }
      
      // Here you would implement the actual search using the service's API
      // Mock response for example purposes
      const mockResults = [
        {
          id: `${service}-song-1`,
          title: 'Example Song 1',
          artist: 'Example Artist',
          album: 'Example Album',
          duration: 180,
          coverImage: 'https://via.placeholder.com/150'
        },
        {
          id: `${service}-song-2`,
          title: 'Example Song 2',
          artist: 'Example Artist',
          album: 'Example Album',
          duration: 240,
          coverImage: 'https://via.placeholder.com/150'
        }
      ];
      
      return res.status(200).json(mockResults);
    } else {
      // Search across all connected services
      const connectedServices = Object.keys(user.connections)
        .filter(svc => user.connections[svc].connected);
      
      if (connectedServices.length === 0) {
        return res.status(400).json({ 
          message: 'You need to connect at least one music service' 
        });
      }
      
      // Mock combined results from all services
      const mockCombinedResults = connectedServices.flatMap(svc => [
        {
          id: `${svc}-song-1`,
          title: 'Example Song 1',
          artist: 'Example Artist',
          album: 'Example Album',
          duration: 180,
          service: svc,
          coverImage: 'https://via.placeholder.com/150'
        },
        {
          id: `${svc}-song-2`,
          title: 'Example Song 2',
          artist: 'Example Artist',
          album: 'Example Album',
          duration: 240,
          service: svc,
          coverImage: 'https://via.placeholder.com/150'
        }
      ]);
      
      res.status(200).json(mockCombinedResults);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Match a song between services
router.post('/match', auth, async (req, res) => {
  try {
    const { song, targetService } = req.body;
    
    if (!song || !song.title || !song.artist) {
      return res.status(400).json({ message: 'Song details are required' });
    }
    
    if (!targetService || !['spotify', 'appleMusic', 'amazonMusic'].includes(targetService)) {
      return res.status(400).json({ message: 'Valid target service is required' });
    }
    
    // Check if user is connected to the target service
    const user = await User.findById(req.user.id);
    if (!user.connections[targetService] || !user.connections[targetService].connected) {
      return res.status(400).json({ 
        message: `You need to connect your ${targetService} account first` 
      });
    }
    
    // Here you would implement the actual matching using the service's API
    // This would search for the song on the target service using title and artist
    // Mock response for example purposes
    const mockMatch = {
      id: `${targetService}-matched-id`,
      title: song.title,
      artist: song.artist,
      album: song.album || 'Unknown Album',
      duration: song.duration || 180,
      coverImage: 'https://via.placeholder.com/150',
      confidence: 0.95 // Match confidence score
    };
    
    res.status(200).json(mockMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Import a playlist from a service
router.post('/import', auth, async (req, res) => {
  try {
    const { playlistId, service } = req.body;
    
    if (!playlistId) {
      return res.status(400).json({ message: 'Playlist ID is required' });
    }
    
    if (!service || !['spotify', 'appleMusic', 'amazonMusic'].includes(service)) {
      return res.status(400).json({ message: 'Valid service is required' });
    }
    
    // Check if user is connected to the service
    const user = await User.findById(req.user.id);
    if (!user.connections[service] || !user.connections[service].connected) {
      return res.status(400).json({ 
        message: `You need to connect your ${service} account first` 
      });
    }
    
    // Here you would implement the actual import using the service's API
    // Mock response for example purposes
    const mockImportedPlaylist = {
      name: `Imported from ${service}`,
      description: `This playlist was imported from ${service}`,
      coverImage: 'https://via.placeholder.com/300',
      creator: req.user.id,
      songs: [
        {
          title: 'Imported Song 1',
          artist: 'Example Artist',
          album: 'Example Album',
          duration: 180,
          coverImage: 'https://via.placeholder.com/150',
          [`${service}Id`]: `${service}-song-1` 
        },
        {
          title: 'Imported Song 2',
          artist: 'Another Artist',
          album: 'Another Album',
          duration: 210,
          coverImage: 'https://via.placeholder.com/150',
          [`${service}Id`]: `${service}-song-2`
        }
      ],
      sourceService: service,
      originalId: playlistId
    };
    
    // Create new playlist
    const playlist = new Playlist(mockImportedPlaylist);
    const savedPlaylist = await playlist.save();
    
    // Populate creator info
    await savedPlaylist.populate('creator', 'username avatar').execPopulate();
    
    res.status(201).json(savedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;