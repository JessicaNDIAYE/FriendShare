 
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlaylistDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    // Fetch playlist details and songs
    if (route.params?.playlistId) {
      // TODO: Implement API call to get playlist details
      setPlaylist({
        id: route.params.playlistId,
        name: 'My Awesome Playlist',
        owner: 'John Doe',
        coverImage: 'https://example.com/playlist-cover.jpg',
      });

      // TODO: Implement API call to get playlist songs
      setSongs([
        {
          id: '1',
          title: 'Song 1',
          artist: 'Artist 1',
          duration: '3:45',
          albumArt: 'https://example.com/album1.jpg',
        },
        // Add more sample songs as needed
      ]);
    }
  }, [route.params?.playlistId]);

  const renderSongItem = ({ item }) => (
    <TouchableOpacity style={styles.songItem}>
      <Image source={{ uri: item.albumArt }} style={styles.albumArt} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <Text style={styles.songDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  if (!playlist) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: playlist.coverImage }} style={styles.playlistCover} />
        <Text style={styles.playlistName}>{playlist.name}</Text>
        <Text style={styles.playlistOwner}>Created by {playlist.owner}</Text>
      </View>

      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        style={styles.songList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  playlistCover: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  playlistOwner: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  songList: {
    flex: 1,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  songInfo: {
    flex: 1,
    marginLeft: 10,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
  },
  songDuration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
});

export default PlaylistDetailScreen;
