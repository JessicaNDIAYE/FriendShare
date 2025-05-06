
 import React, { useState } from 'react';
 import {
   View,
   Text,
   StyleSheet,
   FlatList,
   TouchableOpacity,
   Image,
 } from 'react-native';
 import { Icon } from 'react-native-elements';
 
 const dummyFriends = [
   { id: '1', name: 'Léa', avatar: require('../../assets/avatars/lea.png'), status: 'Écoute Lo-fi chill 🎵' },
   { id: '2', name: 'Nina', avatar: require('../../assets/avatars/nina.png'), status: 'A aimé une playlist 💖' },
   { id: '3', name: 'Max', avatar: require('../../assets/avatars/max.png'), status: 'A rejoint l’app ! 🎉' },
 ];
 
 const FriendsScreen = ({ navigation }) => {
   const [friends, setFriends] = useState(dummyFriends);
 
   const renderFriend = ({ item }) => (
     <View style={styles.friendCard}>
       <Image source={item.avatar} style={styles.avatar} />
       <View style={styles.info}>
         <Text style={styles.name}>{item.name}</Text>
         <Text style={styles.status}>{item.status}</Text>
       </View>
     </View>
   );
 
   return (
     <View style={styles.container}>
       <Text style={styles.title}>👯‍♀️ Mes amis</Text>
 
       <FlatList
         data={friends}
         keyExtractor={(item) => item.id}
         renderItem={renderFriend}
         contentContainerStyle={styles.list}
       />
 
       <TouchableOpacity style={styles.addButton} onPress={() => {}}>
         <Icon name="account-plus" type="material-community" color="#FFF" size={24} />
         <Text style={styles.addButtonText}>Ajouter un·e ami·e</Text>
       </TouchableOpacity>
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#FFF0F5',
     paddingTop: 30,
     paddingHorizontal: 20,
   },
   title: {
     fontSize: 26,
     fontWeight: 'bold',
     color: '#FF6B6B',
     marginBottom: 20,
     textAlign: 'center',
   },
   list: {
     paddingBottom: 20,
   },
   friendCard: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#FFF',
     padding: 15,
     borderRadius: 16,
     marginBottom: 12,
     shadowColor: '#000',
     shadowOpacity: 0.05,
     shadowRadius: 8,
     elevation: 1,
   },
   avatar: {
     width: 52,
     height: 52,
     borderRadius: 26,
     marginRight: 15,
   },
   info: {
     flex: 1,
   },
   name: {
     fontSize: 17,
     fontWeight: '600',
     color: '#333',
   },
   status: {
     fontSize: 13,
     color: '#888',
     marginTop: 4,
   },
   addButton: {
     marginTop: 20,
     backgroundColor: '#FF6B6B',
     paddingVertical: 12,
     borderRadius: 30,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     elevation: 2,
   },
   addButtonText: {
     color: '#FFF',
     fontSize: 16,
     marginLeft: 10,
     fontWeight: '600',
   },
 });
 
 export default FriendsScreen;
 
