# FriendShare
# Architecture technique - PlaylistShare

## 1. Vue d'ensemble

PlaylistShare est une application mobile qui permet aux utilisateurs de créer et partager des playlists avec leurs amis, indépendamment de la plateforme de streaming qu'ils utilisent (Spotify, Apple Music, etc.).

## 2. Stack technologique

### Frontend
- **Framework**: React Native (pour développer une application cross-platform iOS/Android)
- **État de l'application**: Redux ou Context API
- **UI/UX**: Styled Components et animations avec React Native Reanimated
- **Navigation**: React Navigation

### Backend
- **API**: Node.js avec Express
- **Base de données**: 
  - MongoDB (pour les données utilisateurs, relations d'amitié, etc.)
  - Redis (pour le cache et les sessions)
- **Authentification**: JWT, OAuth pour les connexions via Spotify/Apple Music
- **Hébergement**: AWS, Google Cloud ou Firebase

### Services externes
- API Spotify
- API Apple Music
- API Deezer (optionnel)
- API YouTube Music (optionnel)

## 3. Structure de la base de données

### Collection Users
```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "password": "String (hashed)",
  "avatar": "String (URL)",
  "friends": ["ObjectId (User)"],
  "connections": {
    "spotify": {
      "connected": "Boolean",
      "accessToken": "String",
      "refreshToken": "String",
      "userId": "String"
    },
    "appleMusic": {
      "connected": "Boolean",
      "accessToken": "String",
      "userId": "String"
    }
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection Playlists
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "coverImage": "String (URL)",
  "creator": "ObjectId (User)",
  "sharedWith": ["ObjectId (User)"],
  "songs": [
    {
      "title": "String",
      "artist": "String",
      "album": "String",
      "duration": "Number",
      "spotifyId": "String",
      "appleMusicId": "String",
      "deezerId": "String",
      "youtubeId": "String"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection Notifications
```json
{
  "_id": "ObjectId",
  "type": "String (PLAYLIST_SHARED, FRIEND_REQUEST, etc.)",
  "sender": "ObjectId (User)",
  "recipient": "ObjectId (User)",
  "content": "Object (données spécifiques au type)",
  "read": "Boolean",
  "createdAt": "Date"
}
```

## 4. Architecture des API

### API Utilisateurs
- POST /api/users/register
- POST /api/users/login
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users/friends
- POST /api/users/friends/request
- PUT /api/users/friends/accept

### API Playlists
- GET /api/playlists
- POST /api/playlists
- GET /api/playlists/:id
- PUT /api/playlists/:id
- DELETE /api/playlists/:id
- POST /api/playlists/:id/share
- GET /api/playlists/shared

### API Musique
- GET /api/music/search
- POST /api/music/match (correspondance de morceaux entre plateformes)
- POST /api/music/import (importation depuis Spotify/Apple Music)
- POST /api/music/export (exportation vers Spotify/Apple Music)

### API Notifications
- GET /api/notifications
- PUT /api/notifications/:id/read
- DELETE /api/notifications/:id

## 5. Sécurité

- Authentification par JWT
- Validation des données avec Joi ou Yup
- Protection CSRF
- Rate limiting
- Chiffrement des données sensibles
- Gestion sécurisée des tokens d'accès aux services tiers

## 6. Flux de travail principal

1. L'utilisateur se connecte et autorise l'accès à sa plateforme préférée (Spotify/Apple Music)
2. L'utilisateur crée une playlist ou importe une playlist existante
3. L'utilisateur partage la playlist avec un ou plusieurs amis
4. Les amis reçoivent une notification et peuvent accéder à la playlist
5. Ils peuvent exporter la playlist vers leur plateforme de streaming préférée

## 7. Processus de correspondance des morceaux

Pour permettre la compatibilité entre plateformes, l'application utilise un processus de correspondance :

1. Pour chaque morceau, extraire les métadonnées (titre, artiste, album, durée)
2. Utiliser ces métadonnées pour rechercher la correspondance sur la plateforme cible
3. Calculer un score de similarité pour chaque résultat
4. Sélectionner la correspondance la plus probable
5. Stocker les IDs des deux plateformes pour des utilisations futures
