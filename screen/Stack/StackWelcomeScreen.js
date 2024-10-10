import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const StackWelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('TabNavigator');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        // source={require('../../assets/palma-roma-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to Palma Roma</Text>
      <Text style={styles.subtitle}>Discover the beauty of Rome</Text>
    </View>
  );
};

export default StackWelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});