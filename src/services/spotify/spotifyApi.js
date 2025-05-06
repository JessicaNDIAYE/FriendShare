
// src/services/spotify/spotifyApi.js

const axios = require('axios');
const qs = require('querystring');

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';

// Get Spotify access token using auth code
const getAccessToken = async (authCode, redirectUri) => {
  try {
    const data = qs.stringify({
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUri
    });
    
    const response = await axios.post(SPOTIFY_AUTH_URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`
      }
    });
    
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    };
  } catch (error) {
    throw new Error(`Spotify authorization failed: ${error.message}`);
  }
};

// Refresh Spotify access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const data = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });
    
    const response = await axios.post(SPOTIFY_AUTH_URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`
      }
    });
    
    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in
    };
  } catch (error) {
    throw new Error(`Spotify token refresh failed: ${error.message}`);
  }
};

// Search for tracks on Spotify
const searchTracks = async (query, accessToken, limit = 20) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      params: {
        q: query,
        type: 'track',
        limit
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    // Transform Spotify response to our app's format
    return response.data.tracks.items.map(track => ({
      spotifyId: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      duration: Math.floor(track.duration_ms / 1000),
      coverImage: track.album.images[0]?.url || null
    }));
  } catch (error) {
    throw new Error(`Spotify search failed: ${error.message}`);
  }
};

// Get user's Spotify playlists
const getUserPlaylists = async (accessToken, limit = 50) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/me/playlists`, {
      params: { limit },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    return response.data.items.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      tracks: playlist.tracks.total,
      coverImage: playlist.images[0]?.url || null,
      owner: playlist.owner.display_name,
      service: 'spotify'
    }));
  } catch (error) {
    throw new Error(`Failed to fetch Spotify playlists: ${error.message}`);
  }
};

// Get tracks from a Spotify playlist
const getPlaylistTracks = async (playlistId, accessToken) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const playlistInfo = {
      name: response.data.name,
      description: response.data.description || '',
      coverImage: response.data.images[0]?.url || null,
      songs: response.data.tracks.items.map(item => ({
        spotifyId: item.track.id,
        title: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(', '),
        album: item.track.album.name,
        duration: Math.floor(item.track.duration_ms / 1000),
        coverImage: item.track.album.images[0]?.url || null
      }))
    };
    
    return playlistInfo;
  } catch (error) {
    throw new Error(`Failed to fetch Spotify playlist tracks: ${error.message}`);
  }
};

// Create a playlist on Spotify
const createPlaylist = async (userId, accessToken, { name, description, isPublic = false }) => {
  try {
    const response = await axios.post(
      `${SPOTIFY_API_URL}/users/${userId}/playlists`,
      {
        name,
        description,
        public: isPublic
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description,
      service: 'spotify'
    };
  } catch (error) {
    throw new Error(`Failed to create Spotify playlist: ${error.message}`);
  }
};

// Add tracks to a Spotify playlist
const addTracksToPlaylist = async (playlistId, trackUris, accessToken) => {
  try {
    // Spotify has a limit of 100 tracks per request
    const chunkSize = 100;
    
    for (let i = 0; i < trackUris.length; i += chunkSize) {
      const chunk = trackUris.slice(i, i + chunkSize);
      
      await axios.post(
        `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
        {
          uris: chunk
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return true;
  } catch (error) {
    throw new Error(`Failed to add tracks to Spotify playlist: ${error.message}`);
  }
};

module.exports = {
  getAccessToken,
  refreshAccessToken,
  searchTracks,
  getUserPlaylists,
  getPlaylistTracks,
  createPlaylist,
  addTracksToPlaylist
};