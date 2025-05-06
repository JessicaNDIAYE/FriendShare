import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  // Exemple de données locales pour les notifications
  const notificationsData = [
    {
      id: '1',
      message: 'You have a new friend request from John Doe',
      createdAt: new Date(),
      type: 'friendRequest',
      senderId: 'user123',
    },
    {
      id: '2',
      message: 'Your playlist "Chill Vibes" was liked by Jane Doe',
      createdAt: new Date(),
      type: 'playlistLike',
      senderId: 'user456',
    },
    {
      id: '3',
      message: 'You have a new message from Michael Smith',
      createdAt: new Date(),
      type: 'message',
      senderId: 'user789',
    },
  ];

  useEffect(() => {
    // Simuler la récupération de notifications
    setNotifications(notificationsData);
  }, []);

  const renderNotification = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.notificationItem}
        onPress={() => {
          if (item.type === 'friendRequest') {
            navigation.navigate('Profile', { userId: item.senderId });
          }
          // Ajouter d'autres actions en fonction du type de notification
        }}
      >
        <Text style={styles.notificationText}>{item.message}</Text>
        <Text style={styles.timeText}>
          {item.createdAt.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>No notifications yet</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
});

export default NotificationsScreen;
