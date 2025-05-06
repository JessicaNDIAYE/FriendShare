// App.js - Point d'entrée de l'application

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { Icon } from 'react-native-elements';
//import { store } from './src/store';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PlaylistsScreen from './src/screens/PlaylistsScreen';
import PlaylistDetailScreen from './src/screens/PlaylistDetailScreen';
import CreatePlaylistScreen from './src/screens/CreatePlaylistScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
//import ServiceConnectionScreen from './src/screens/ServiceConnectionScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Playlists') {
            iconName = 'playlist-music';
          } else if (route.name === 'Friends') {
            iconName = 'account-group';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }
          
          return <Icon name={iconName} type="material-community" size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#FF6B6B',
        inactiveTintColor: 'gray',
        style: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#FFF',
          position: 'absolute',
          padding: 5,
          height: 60,
        }
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Playlists" component={PlaylistsScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
          <Stack.Screen name="CreatePlaylist" component={CreatePlaylistScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="ServiceConnection" component={ServiceConnectionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;