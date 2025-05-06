// src/services/api.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.playlistshare.com/api'; // Remplacer par votre URL d'API

// Création de l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token d'authentification
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de token expiré
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        
        const { token } = response.data;
        await AsyncStorage.setItem('token', token);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        return api(originalRequest);
      } catch (err) {
        // Si le refresh token échoue, rediriger vers la page de connexion
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        // Ici, vous devriez implémenter une logique pour rediriger vers la page de connexion
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;