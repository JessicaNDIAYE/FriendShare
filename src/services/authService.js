// src/services/authService.js

import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, refreshToken, user } = response.data;
    
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    
    return user;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la connexion');
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    const { token, refreshToken, user } = response.data;
    
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    
    return user;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de l\'inscription');
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la récupération du profil');
  }
};

export const connectService = async (service, authCode) => {
  try {
    const response = await api.post(`/users/connect/${service}`, { authCode });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Échec de la connexion à ${service}`);
  }
};

export const disconnectService = async (service) => {
  try {
    const response = await api.post(`/users/disconnect/${service}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Échec de la déconnexion de ${service}`);
  }
};