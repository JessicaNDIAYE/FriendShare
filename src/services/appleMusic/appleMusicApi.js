// src/services/appleMusic/appleMusicApi.js

const axios = require('axios');
const jwt = require('jsonwebtokené');

const APPLE_MUSIC_API_URL = 'https://api.music.apple.com/v1';

// Generate developer token for Apple Music API
const generateDeveloperToken = () => {
  const privateKey = process.env.APPLE_MUSIC_PRIVATE_KEY;
  const teamId = process.env.APPLE_MUSIC_TEAM_ID;
  const keyId = process.env.APPLE_MUSIC_KEY_ID;
  
  const token = jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    expiresIn: '12h',
    issuer: teamId,
    header: {
      alg: 'ES256',
      kid: keyId
    }
  });
  
  return token;
};

// Search for tracks on Apple Music
const searchTracks = async (query, userToken, limit = 20) => {
  try {
    const developerToken = generateDeveloperToken();
    
    const response = await axios.get(`${APPLE_MUSIC_API_URL}/catalog/us/search`, {
      params: {
        term: query,
        types: 'songs',
        limit
      },
      headers: {
        'Authorization': `Bearer ${developerToken}`,
        'Music-User-Token': userToken
      }
    });
    
    // Transform Apple Music response to our app's format
    return response.data.results.songs.data.map(song => ({
      appleMusicId: song.id,
      title: song.attributes.name,
      artist: song.attributes.artistName,
      album: song.attributes.albumName,
      duration: Math.floor(song.attributes.durationInMillis / 1000),
      coverImage: song.attributes.artwork.url
        .replace('{w}', '300')
        .replace('{h}', '300')
    }));
  } catch (error) {
    throw new Error(`Apple Music search failed: ${error.message}`);
  }
};

// Get user's Apple Music playlists
const getUserPlaylists = async (userToken, limit = 50) => {
  try {
    const developerToken = generateDeveloperToken();
    
    const response = await axios.get(`${APPLE_MUSIC_API_URL}/me/library/playlists`, {
      params: { limit },
      headers: {
        'Authorization': `Bearer ${developerToken}`,
        'Music-User-Token': userToken
      }
    });
    
    return response.data.data.map(playlist => ({
      id: playlist.id,
      name: playlist.attributes.name,
      description: playlist.attributes.description?.standard || '',
      tracks: playlist.relationships?.tracks?.data?.length || 0,
      coverImage: playlist.attributes.artwork?.url
        .replace('{w}', '300')
        .replace('{h}', '300') || null,
      service: 'appleMusic'
    }));
  } catch (error) {
    throw new Error(`Failed to fetch Apple Music playlists: ${error.message}`);
  }
};

// Get tracks from an Apple Music playlist
const getPlaylistTracks = async (playlistId, userToken) => {
  try {
    const developerToken = generateDeveloperToken();
    
    const response = await axios.get(
      `${APPLE_MUSIC_API_URL}/me/library/playlists/${playlistId}/tracks`,
      {
        headers: {
          'Authorization': `Bearer ${developerToken}`,
          'Music-User-Token': userToken
        }
      }
    );
    
    // Get playlist details
    const playlistResponse = await axios.get(
      `${APPLE_MUSIC_API_URL}/me/library/playlists/${playlistId}`,
      {
        headers: {
          'Authorization': `Bearer ${developerToken}`,
          'Music-User-Token': userToken
        }
      }
    );
    
    const playlistData = playlistResponse.data.data[0];
    
    const playlistInfo = {
      name: playlistData.attributes.name,
      description: playlistData.attributes.description?.standard || '',
      coverImage: playlistData.attributes.artwork?.url
        .replace('{w}', '300')
        .replace('{h}', '300') || null,
      songs: response.data.data.map(song => ({
        appleMusicId: song.id,
        title: song.attributes.name,
        artist: song.attributes.artistName,
        album: song.attributes.albumName,
        duration: Math.floor(song.attributes.durationInMillis / 1000),
        coverImage: song.attributes.artwork.url
          .replace('{w}', '300')
          .replace('{h}', '300')
      }))
    };
    
    return playlistInfo;
  } catch (error) {
    throw new Error(`Failed to fetch Apple Music playlist tracks: ${error.message}`);
  }
};

// Create a playlist on Apple Music
const createPlaylist = async (userToken, { name, description }) => {
  try {
    const developerToken = generateDeveloperToken();
    
    const response = await axios.post(
      `${APPLE_MUSIC_API_URL}/me/library/playlists`,
      {
        attributes: {
          name,
          description: { standard: description || '' }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${developerToken}`,
          'Music-User-Token': userToken,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      id: response.data.data[0].id,
      name,
      description,
      service: 'appleMusic'
    };
  } catch (error) {
    throw new Error(`Failed to create Apple Music playlist: ${error.message}`);
  }
};

// Add tracks to an Apple Music playlist
const addTracksToPlaylist = async (playlistId, trackIds, userToken) => {
  try {
    const developerToken = generateDeveloperToken();
    
    const trackData = trackIds.map(id => ({
      id,
      type: 'songs'
    }));
    
    await axios.post(
      `${APPLE_MUSIC_API_URL}/me/library/playlists/${playlistId}/tracks`,
      { data: trackData },
      {
        headers: {
          'Authorization':Bearer ${developerToken}, 'Music-User-Token': userToken, 'Content-Type': 'application/json' } } );
          return true;
          } catch (error) { 
            throw new Error(Failed to add tracks to Apple Music playlist: ${error.message}); 
        } };
          
          module.exports = { generateDeveloperToken, searchTracks, getUserPlaylists, getPlaylistTracks, createPlaylist, addTracksToPlaylist 

          };