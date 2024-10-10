import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { GUIDE } from '../../data/guide';

const { width } = Dimensions.get('window');

const TabGuideScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Choose Your Guide</Text>
      <View style={styles.guideContainer}>
        {GUIDE.map((guide) => (
          <TouchableOpacity key={guide.id} style={styles.guideButton}>
            <View style={styles.imageContainer}>
              <Image source={guide.image} style={styles.guideImage} />
            </View>
            <Text style={styles.guideName}>{guide.guide}</Text>
          </TouchableOpacity>
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
  guideButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    paddingTop: 40,
    width: width - 40,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 80,
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
});