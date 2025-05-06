// src/screens/CreatePlaylistScreen.js

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import { createPlaylist } from '../store/actions/playlistActions';
import SongSearchBar from '../components/SongSearchBar';
import SongItem from '../components/SongItem';

const CreatePlaylistScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();

  const selectCoverImage = () => {
    const options = {
      title: 'Sélectionner une image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      includeBase64: true,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Sélection d\'image annulée');
      } else if (response.error) {
        console.log('Erreur ImagePicker: ', response.error);
      } else {
        setCoverImage(response.assets[0]);
      }
    });
  };

  const handleAddSong = (song) => {
    // Vérifier si la chanson existe déjà dans la liste
    if (!songs.some(s => s.id === song.id)) {
      setSongs([...songs, song]);
    } else {
      Alert.alert('Information', 'Cette chanson est déjà dans votre playlist');
    }
  };

  const handleRemoveSong = (songId) => {
    setSongs(songs.filter(song => song.id !== songId));
  };

  const handleCreatePlaylist = async () => {
    if (!name.trim()) {
      setError('Veuillez donner un nom à votre playlist');
      return;
    }

    if (songs.length === 0) {
      setError('Ajoutez au moins une chanson à votre playlist');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const playlistData = {
        name,
        description,
        coverImage: coverImage ? `data:image/jpeg;base64,${coverImage.base64}` : null,
        songs,
      };

      await dispatch(createPlaylist(playlistData));
      navigation.navigate('Playlists');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSongList = () => {
    if (songs.length === 0) {
      return (
        <View style={styles.emptySongsContainer}>
          <Icon
            name="music-note-off"
            type="material-community"
            size={50}
            color="#DDD"
          />
          <Text style={styles.emptySongsText}>
            Aucune chanson ajoutée
          </Text>
        </View>
      );
    }

    return songs.map((song) => (
      <SongItem
        key={song.id}
        song={song}
        onRemove={() => handleRemoveSong(song.id)}
        showRemoveButton
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" type="material-community" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer une playlist</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.coverSection}>
          <TouchableOpacity
            style={styles.coverContainer}
            onPress={selectCoverImage}
          >
            {coverImage ? (
              <Image
                source={{ uri: coverImage.uri }}
                style={styles.coverImage}
              />
            ) : (
              <View style={styles.placeholderCover}>
                <Icon
                  name="image-plus"
                  type="material-community"
                  size={40}
                  color="#999"
                />
                <Text style={styles.coverText}>Ajouter une image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="Nom de la playlist"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optionnelle)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={200}
          />
        </View>

        <View style={styles.songsSection}>
          <Text style={styles.sectionTitle}>Ajouter des chansons</Text>
          
          <SongSearchBar onSelectSong={handleAddSong} />
          
          <View style={styles.songsList}>
            {renderSongList()}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePlaylist}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.createButtonText}>Créer la playlist</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 30,
  },
  content: {
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  coverSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coverContainer: {
    width: 150,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  },
  formSection: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 15,
  },
  songsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  songsList: {
    marginTop: 20,
  },
  emptySongsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  emptySongsText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  createButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreatePlaylistScreen;