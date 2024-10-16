import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Animated } from 'react-native';

const StackWelcomeScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('TabNavigator');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, slideAnim]);

  return (
    <ImageBackground 
      source={require('../../assets/image/newDesign/bg.png')} 
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.title}>Welcome to Le Palme Roma: Time Traveler</Text>
          <Text style={styles.subtitle}>Discover the Eternal City</Text>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default StackWelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(139, 69, 19, 0.3)', 
    paddingTop: 100,
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFD700', // Gold color
    textAlign: 'center',
    fontFamily: 'serif',
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 24,
    color: '#FFF8DC', // Light cream color
    textAlign: 'center',
    fontFamily: 'serif',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
