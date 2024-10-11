import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { GUIDE } from '../../data/guide';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const TabGuideScreen = () => {
  const navigation = useNavigation();

  const handleGuidePress = (guide) => {
    navigation.navigate('StackGuideDetails', { guide });
  };

  const handleGamePress = (guide) => {
    navigation.navigate('StackGameScreen', { 
      guideName: guide.guide,
      gameImage: guide.image
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Choose Your Guide</Text>
      <View style={styles.guideContainer}>
        {GUIDE.map((guide) => (
          <View key={guide.id} style={styles.guideWrapper}>
            <TouchableOpacity 
              style={styles.guideButton}
              onPress={() => handleGuidePress(guide)}
            >
              <View style={styles.imageContainer}>
                <Image source={guide.image} style={styles.guideImage} />
              </View>
              <Text style={styles.guideName}>{guide.guide}</Text>
              <TouchableOpacity 
                style={styles.gameButton}
                onPress={() => handleGamePress(guide)}
              >
                <Text style={styles.gameButtonText}>Play {guide.guide}'s Game</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TabGuideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C', // Tan color for background
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color for title
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  guideContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  guideWrapper: {
    marginBottom: 40,
    alignItems: 'center',
  },
  guideButton: {
    alignItems: 'center',
    backgroundColor: '#CD7F32', // Bronze color for guide button
    borderRadius: 15,
    padding: 20,
    paddingTop: 60,
    width: width - 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod color for border
  },
  imageContainer: {
    position: 'absolute',
    top: -40,
    backgroundColor: '#FFD700', // Gold color for image container
    borderRadius: 70,
    padding: 5,
    borderWidth: 2,
    borderColor: '#8B4513', // Saddle Brown color for image border
  },
  guideImage: {
    width: 115,
    height: 140,
    borderRadius: 65,
  },
  guideName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF', // White color for guide name
    textAlign: 'center',
    marginTop: 70,
    marginBottom: 20,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  gameButton: {
    backgroundColor: '#8B4513', // Saddle Brown color for game button
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod color for game button border
  },
  gameButtonText: {
    color: '#FFD700', // Gold color for game button text
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
});