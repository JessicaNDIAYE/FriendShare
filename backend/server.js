// src/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const playlistRoutes = require('./routes/playlists');
const musicRoutes = require('./routes/music');
const notificationRoutes = require('./routes/notifications');

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());  // Pour parser le corps des requêtes en JSON
app.use(cors());  // CORS pour permettre les requêtes depuis différents domaines
app.use(helmet());  // Pour la sécurité
app.use(morgan('dev'));  // Logger des requêtes HTTP

// Rate limiting - Limiter les requêtes pour éviter les abus
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limiter chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes, veuillez réessayer plus tard'
});
app.use('/api/', limiter);

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/notifications', notificationRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
