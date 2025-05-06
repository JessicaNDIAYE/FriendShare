// src/services/musicService.js

import api from './api';

export const searchSongs = async (query, service) => {
  try {
    const response = await api.get('/music/search', {
      params: { q: query, service }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la recherche de chansons');
  }
};

export const matchSong = async (songData, targetService) => {
  try {
    const response = await api.post('/music/match', {
      song: songData,
      targetService
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la correspondance de la chanson');
  }
};

export const importPlaylist = async (servicePlaylistId, service) => {
  try {
    const response = await api.post('/music/import', {
      playlistId: servicePlaylistId,
      service
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de l\'importation de la playlist');
  }
};