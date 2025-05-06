// src/components/SongSearchBar.js

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { searchSongs } from '../services/musicService';
import SongItem from './SongItem';

const SongSearchBar = ({ onSelectSong }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const { connections } = useSelector(state => state.auth.user || {});

  const handleSearch = async (text) => {
    setQuery(text);
    
    if (text.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    
    setLoading(true);
    setError('');
    setShowResults(true);
    
    try {
      // Déterminer quelle API de musique utiliser en fonction des connexions de l'utilisateur
      const serviceToUse = connections?.spotify?.connected ? 'spotify' : 
                           connections?.appleMusic?.connected ? 'appleMusic' : 'spotify';
      
      const searchResults = await searchSongs(text, serviceToUse);
      setResults(searchResults);
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSong = (song) => {
    onSelectSong(song);
    setQuery('');
    setResults([]);
    setShowResults(false);
    Keyboard.dismiss();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  useEffect(() => {
    const hideResultsOnKeyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      if (results.length === 0) {
        setShowResults(false);
      }
    });

    return () => {
      hideResultsOnKeyboardHide.remove();
    };
  }, [results]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon
          name="magnify"
          type="material-community"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une chanson..."
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Icon
              name="close-circle"
              type="material-community"
              size={18}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>
      
      {showResults && (
        <View style={styles.resultsContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#FF6B6B" style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={({ item }) => (
                <SongItem
                  song={item}
                  onPress={() => handleSelectSong(item)}
                />
              )}
              keyExtractor={(item) => item.id}
              maxHeight={300}
              keyboardShouldPersistTaps="handled"
            />
          ) : query.length >= 2 ? (
            <Text style={styles.noResults}>Aucun résultat trouvé</Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  resultsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 10,
    maxHeight: 300,
    overflow: 'hidden',
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loader: {
    padding: 20,
  },
  errorText: {
    padding: 20,
    color: 'red',
    textAlign: 'center',
  },
  noResults: {
    padding: 20,
    textAlign: 'center',
    color: '#999',
  },
});

export default SongSearchBar;

