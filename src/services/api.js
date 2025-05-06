import axios from 'axios';

const API_URL = 'https://api.playlistshare.com/api'; // Remplacer par votre URL d'API

// Création de l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction pour récupérer les utilisateurs
const getUsers = async () => {
  try {
    const response = await api.get('/users'); // Remplacer par le bon endpoint pour récupérer les utilisateurs
    return response.data; // Retourner la liste des utilisateurs
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

// Fonction pour obtenir un utilisateur par son ID
const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`); // Remplacer par le bon endpoint
    return response.data; // Retourner les données de l'utilisateur
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
};

// Fonction pour créer un utilisateur (si tu as un formulaire d'inscription)
const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData); // Remplacer par le bon endpoint
    return response.data; // Retourner les données de l'utilisateur créé
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
};

// Fonction pour modifier un utilisateur
const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData); // Remplacer par le bon endpoint
    return response.data; // Retourner les données de l'utilisateur modifié
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }
};

// Fonction pour supprimer un utilisateur
const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`); // Remplacer par le bon endpoint
    return response.data; // Retourner la réponse du serveur après suppression
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    throw error;
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
