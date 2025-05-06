 
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';

const ProfileScreen = ({ navigation }) => {
  const user = {
    name: 'Emma Douceur',
    username: '@emma_vibes',
    //avatar: require('../../assets/avatars/emma.png'),
    bio: 'Amoureuse de musique douce et de playlists cozy 🌙🎶',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={user.avatar} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.bio}>{user.bio}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎧 Mes stats musicales</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Playlists</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>128</Text>
            <Text style={styles.statLabel}>Morceaux</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>9</Text>
            <Text style={styles.statLabel}>Amis</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="account-edit" type="material-community" color="#FFF" size={22} />
          <Text style={styles.editText}>Modifier mon profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
          <Icon name="logout" type="material-community" color="#FF6B6B" size={22} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  bio: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  section: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 13,
    color: '#777',
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  editText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderColor: '#FF6B6B',
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ProfileScreen;
