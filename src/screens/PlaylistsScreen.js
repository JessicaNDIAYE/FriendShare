 
// src/screens/PlaylistsScreen.js

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from 'react-native-elements';
import { fetchPlaylists } from '../store/actions/playlistActions';
import PlaylistCard from '../components/PlaylistCard';
import EmptyState from '../components/EmptyState';

const PlaylistsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { playlists, loading, error } = useSelector(state => state.playlists);
  const dispatch = useDispatch();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    dispatch(fetchPlaylists());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlaylists();
    setRefreshing(false);
  };

  const navigateToCreatePlaylist = () => {
    navigation.navigate('CreatePlaylist');
  };

  const renderItem = ({ item }) => (
    <PlaylistCard
      playlist={item}
      onPress={() => navigation.navigate('PlaylistDetail', { playlistId: item._id })}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Playlists</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={navigateToCreatePlaylist}
        >
          <Icon name="plus" type="material-community" color="#FFF" size={22} />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>Erreur: {error}</Text>
      ) : null}

      {playlists && playlists.length > 0 ? (
        <FlatList
          data={playlists}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF6B6B']}
              tintColor="#FF6B6B"
            />
          }
        />
      ) : (
        <EmptyState 
          icon="playlist-music" 
          message="Vous n'avez pas encore de playlists"
          actionLabel="Créer une playlist"
          onAction={navigateToCreatePlaylist}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#FF6B6B',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  listContent: {
    padding: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default PlaylistsScreen;
