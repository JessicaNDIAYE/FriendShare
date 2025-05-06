// backend/controllers/authController.js
const { supabase } = require('../services/supabase');
const jwt = require('jsonwebtoken'); // Pour créer et vérifier les tokens JWT

// Authentification d'un utilisateur
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, error } = await supabase.auth.signIn({ email, password });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    // Générer un token JWT pour l'utilisateur
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
