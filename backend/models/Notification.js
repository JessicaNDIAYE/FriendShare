// src/models/Notification.js

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['PLAYLIST_SHARED', 'FRIEND_REQUEST', 'FRIEND_ACCEPTED', 'PLAYLIST_EXPORTED', 'PLAYLIST_UPDATED'],
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);