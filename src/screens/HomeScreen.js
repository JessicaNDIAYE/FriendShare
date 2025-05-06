 
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>🌸 Bienvenue de retour !</Text>
      <Text style={styles.subtitle}>Prête à découvrir ou créer de la magie musicale ? 🎧</Text>
  
      //<Image
      //   source={require('../../assets/cute-music-illustration.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('Playlists')}
      >
        <Icon name="playlist-music" type="material-community" color="#FFF" size={24} />
        <Text style={styles.buttonText}>Voir mes playlists</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#FFD6E8' }]}
        onPress={() => navigation.navigate('CreatePlaylist')}
      >
        <Icon name="plus-circle" type="material-community" color="#FF6B6B" size={24} />
        <Text style={[styles.buttonText, { color: '#FF6B6B' }]}>Créer une nouvelle playlist</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👯‍♀️ Activité de tes amis</Text>
        <Text style={styles.sectionText}>Pas encore d'activité... invite des amis !</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧸 Astuce du jour</Text>
        <Text style={styles.sectionText}>
          Une playlist bien pensée, c’est comme un câlin pour les oreilles 💕
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  illustration: {
    width: '100%',
    height: 200,
    marginBottom: 25,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 15,
    elevation: 2,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  section: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: '#777',
  },
});

export default HomeScreen;
