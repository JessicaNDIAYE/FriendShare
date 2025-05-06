// src/services/friendService.js

import api from './api';

export const getFriends = async () => {
  try {
    const response = await api.get('/users/friends');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la récupération des amis');
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await api.get('/users/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la recherche d\'utilisateurs');
  }
};

export const sendFriendRequest = async (userId) => {
  try {
    const 