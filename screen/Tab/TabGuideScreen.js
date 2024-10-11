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
      gameImage: guide.image // Using the guide's image for the game
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
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.gameButton}
              onPress={() => handleGamePress(guide)}
            >
              <Text style={styles.gameButtonText}>Play {guide.guide}'s Game</Text>
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
    backgroundColor: '#f5f5f5',
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
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
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    paddingTop: 40,
    width: width - 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginTop: 20,
  },
  imageContainer: {
    position: 'absolute',
    top: -40,
    backgroundColor: '#e0e0e0',
    borderRadius: 70,
    padding: 5,
  },
  guideImage: {
    width: 115,
    height: 140,
    borderRadius: 65,
  },
  guideName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 70,
  },
  gameButton: {
    backgroundColor: '#CD7F32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: width - 40,
  },
  gameButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});