// src/routes/auth.js

const express = require('express');
const router = express.Router();
const { supabase } = require('../services/supabase'); // Assure-toi d'importer ton client Supabase
const jwt = require('jsonwebtoken');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Register
router.post('/register', validateRegistration, async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Crée l'utilisateur avec Supabase Auth
    const { user, error: signupError } = await supabase.auth.signUp({ email, password });

    if (signupError) return res.status(400).json({ message: signupError.message });

    // Enregistre les informations supplémentaires dans la table `users`
    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{ id: user.id, username, email }]);

    if (insertError) return res.status(400).json({ message: insertError.message });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, username },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe avec Supabase Auth
    const { user, error: loginError } = await supabase.auth.signIn({ email, password });

    if (loginError) return res.status(400).json({ message: loginError.message });

    // Génère un token JWT pour l'utilisateur
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Logged in successfully',
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' });

  try {
    // Vérifie le refresh token et génère un nouveau token d'accès
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Génère un nouveau access token
    const token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  // Pour l'instant, le logout n'invalide pas réellement le token, il peut être géré côté client.
  res.status(200).json({ message: 'Logged out successfully' });
});

// Connect to External Service (Spotify, Apple Music, etc.)
router.post('/connect-service', auth, async (req, res) => {
  const { provider, accessToken, refreshToken, providerUserId } = req.body;
  const userId = req.user.id; // L'ID utilisateur provenant du middleware d'authentification

  try {
    // Enregistre la connexion de l'utilisateur au service externe dans `user_connections`
    const { data, error } = await supabase
      .from('user_connections')
      .upsert([
        {
          user_id: userId,
          provider,
          connected: true,
          access_token: accessToken,
          refresh_token: refreshToken,
          provider_user_id: providerUserId,
        },
      ]);

    if (error) return res.status(400).json({ message: error.message });

    res.status(200).json({ message: 'Service connected successfully', data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Disconnect from External Service (Spotify, Apple Music, etc.)
router.post('/disconnect-service', auth, async (req, res) => {
  const { provider } = req.body;
  const userId = req.user.id;

  try {
    // Supprime la connexion de l'utilisateur au service externe dans `user_connections`
    const { data, error } = await supabase
      .from('user_connections')
      .delete()
      .eq('user_id', userId)
      .eq('provider', provider);

    if (error) return res.status(400).json({ message: error.message });

    res.status(200).json({ message: `${provider} disconnected successfully`, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
