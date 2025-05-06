// src/components/SongItem.js

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

const SongItem = ({ song, onPress, onRemove, showRemoveButton = false }) => {
  const { title, artist, album, coverUrl } = song;

  const handlePress = () => {
    if (onPress) {
      onPress(song);
    }
  };

  const getServiceIcon = () => {
    const { source } = song;
    
    if (source === 'spotify') {
      return (
        <View style={[styles.serviceIcon, styles.spotifyIcon]}>
          <Icon name="spotify" type="material-community" size={10} color="#FFF" />
        </View>
      );
    } else if (source === 'appleMusic') {
      return (
        <View style={[styles.serviceIcon, styles.appleMusicIcon]}>
          <Icon name="music" type="material-community" size={10} color="#FFF" />
        </View>
      );
    }
    
    return null;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={!onPress}
    >
      <View style={styles.coverContainer}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.cover} />
        ) : (
          <View style={styles.placeholderCover}>
            <Icon name="music" type="material-community" size={20} color="#DDD" />
          </View>
        )}
        {getServiceIcon()}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
        {album && <Text style={styles.album} numberOfLines={1}>{album}</Text>}
      </View>
      
      {showRemoveButton && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove && onRemove(song.id)}
        >
          <Icon name="close" type="material-community" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  coverContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 15,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotifyIcon: {
    backgroundColor: '#1DB954',
  },
  appleMusicIcon: {
    backgroundColor: '#FA586A',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  artist: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  album: {
    fontSize: 11,
    color: '#999',
  },
  removeButton: {
    padding: 8,
  },
});

export default SongItem;