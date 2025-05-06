// src/services/playlistService.js

import api from './api';

export const getPlaylists = async () => {
  try {
    const response = await api.get('/playlists');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la récupération des playlists');
  }
};

export const getPlaylistById = async (id) => {
  try {
    const response = await api.get(`/playlists/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Playlist introuvable');
  }
};

export const createNewPlaylist = async (playlistData) => {
  try {
    const response = await api.post('/playlists', playlistData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la création de la playlist');
  }
};

export const updatePlaylist = async (id, playlistData) => {
  try {
    const response = await api.put(`/playlists/${id}`, playlistData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la mise à jour de la playlist');
  }
};

export const deletePlaylist = async (id) => {
  try {
    await api.delete(`/playlists/${id}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la suppression de la playlist');
  }
};

export const sharePlaylist = async (id, userIds) => {
  try {
    const response = await api.post(`/playlists/${id}/share`, { userIds });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec du partage de la playlist');
  }
};

export const getSharedPlaylists = async () => {
  try {
    const response = await api.get('/playlists/shared');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la récupération des playlists partagées');
  }
};

export const exportToService = async (playlistId, service) => {
  try {
    const response = await api.post(`/playlists/${playlistId}/export`, { service });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Échec de l'exportation vers ${service}`);
  }
};