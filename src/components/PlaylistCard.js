import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const PlaylistCard = ({ playlist, onPress }) => {
  const { name, description, songs, coverImage, sharedWith } = playlist;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {coverImage ? (
            <Image source={{ uri: coverImage }} style={styles.coverImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="music" type="material-community" color="#FFF" size={30} />
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>

          {description ? (
            <Text style={styles.description} numberOfLines={2}>{description}</Text>
          ) : null}

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="music-note" type="material-community" color="#333" size={14} />
              <Text style={styles.infoText}>{songs.length} titres</Text>
            </View>

            {sharedWith && sharedWith.length > 0 ? (
              <View style={styles.infoItem}>
                <Icon name="account-multiple" type="material-community" color="#333" size={14} />
                <Text style={styles.infoText}>Partagée avec {sharedWith.length}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FF6B6B', // Couleur unie pour la carte
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  infoText: {
    fontSize: 12,
    color: '#FFF',
    marginLeft: 4,
  },
});

export default PlaylistCard;
