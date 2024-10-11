import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StackGuideDetails = ({ route }) => {
  const { guide } = route.params;
  const navigation = useNavigation();

  const renderSection = (section) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.content.map((item, index) => {
        if (typeof item === 'string') {
          return <Text key={index} style={styles.paragraph}>{item}</Text>;
        } else if (item.subtitle) {
          return (
            <View key={index}>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              {item.points.map((point, pointIndex) => (
                <View key={pointIndex} style={styles.point}>
                  <Text style={styles.pointTitle}>{point.title}</Text>
                  <Text style={styles.pointDescription}>{point.description}</Text>
                </View>
              ))}
            </View>
          );
        }
      })}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={guide.image} style={styles.image} />
      </View>
      
      <Text style={styles.name}>{guide.guide}</Text>
      <Text style={styles.period}>{guide.period}</Text>
      <Text style={styles.welcomeText}>{guide.welcomeText}</Text>
      <Text style={styles.articleTitle}>{guide.article.title}</Text>
      {guide.article.sections.map(renderSection)}
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Guides</Text>
      </TouchableOpacity>
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

export default StackGuideDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C', // Tan color for parchment-like background
    padding: 20,
    paddingTop: 60,
  },
  bottomSpace: {
    height: 50,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 260,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#DAA520', // Goldenrod border
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  period: {
    fontSize: 20,
    color: '#CD7F32', // Bronze color
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  welcomeText: {
    fontSize: 18,
    color: '#8B4513', // Saddle Brown color
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod border
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#FFEFD5', // Papaya Whip color for section background
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color
    marginBottom: 15,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 16,
    color: '#5D4037', // Brown color
    marginBottom: 10,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#CD7F32', // Bronze color
    marginTop: 15,
    marginBottom: 10,
    fontFamily: 'serif',
  },
  point: {
    marginBottom: 15,
  },
  pointTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color
    marginBottom: 5,
    fontFamily: 'serif',
  },
  pointDescription: {
    fontSize: 16,
    color: '#5D4037', // Brown color
    fontFamily: 'serif',
  },
  backButton: {
    backgroundColor: '#CD7F32', // Bronze color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#8B4513', // Darker bronze for shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod border
  },
  backButtonText: {
    color: '#FFF8DC', // Light cream color for text
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textTransform: 'uppercase',
    textShadowColor: '#8B4513', // Darker bronze for text shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});