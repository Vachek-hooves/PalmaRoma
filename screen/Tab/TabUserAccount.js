import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import AppLayout from '../../components/Layout/AppLayout';

const USER_DATA_KEY = '@user_data';

const TabUserAccount = () => {
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userData) {
        const { name, image } = JSON.parse(userData);
        setUserName(name);
        setUserImage(image);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async () => {
    try {
      const userData = JSON.stringify({ name: userName, image: userImage });
      await AsyncStorage.setItem(USER_DATA_KEY, userData);
      setIsEditing(false);
      Alert.alert('Success', 'User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: 'data:image/jpeg;base64,' + response.assets[0].base64 };
        setUserImage(source.uri);
      }
    });
  };

  return (
    <AppLayout>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {userImage ? (
            <Image source={{ uri: userImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Tap to add image</Text>
            </View>
          )}
        </TouchableOpacity>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
            placeholderTextColor="#8B4513"
          />
        ) : (
          <Text style={styles.userName}>{userName || 'No name set'}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (isEditing) {
            saveUserData();
          } else {
            setIsEditing(true);
          }
        }}
      >
        <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit Profile'}</Text>
      </TouchableOpacity>
    </AppLayout>
  );
};

export default TabUserAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D2B48C', // Tan color for background
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DAA520', // Saddle Brown color for title
    marginBottom: 30,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#FFEFD5', // Papaya Whip color for profile container
    borderRadius: 15,
    padding: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod border
  },
  imageContainer: {
    width: 150,
    height: 250,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#CD7F32', // Bronze color for image border
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#CD7F32', // Bronze color for placeholder
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFF8DC', // Light cream color for text
    textAlign: 'center',
    fontFamily: 'serif',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color for text
    marginTop: 10,
    fontFamily: 'serif',
  },
  input: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color for text
    marginTop: 10,
    fontFamily: 'serif',
    borderBottomWidth: 1,
    borderBottomColor: '#CD7F32', // Bronze color for input underline
    paddingBottom: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#CD7F32', // Bronze color for button
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod border
  },
  buttonText: {
    color: '#FFF8DC', // Light cream color for text
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
});
