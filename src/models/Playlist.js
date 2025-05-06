// src/models/Playlist.js

const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String
  },
  duration: {
    type: Number
  },
  spotifyId: String,
  appleMusicId: String,
  amazonMusicId: String,
  deezerId: String,
  youtubeId: String,
  coverImage: String
});

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  songs: [SongSchema],
  isPublic: {
    type: Boolean,
    default: false
  },
  sourceService: {
    type: String,
    enum: ['spotify', 'appleMusic', 'amazonMusic', 'deezer', 'youtube', 'custom'],
    default: 'custom'
  },
  originalId: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', PlaylistSchema);