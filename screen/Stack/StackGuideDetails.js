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
      <Image source={guide.image} style={styles.image} />
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
    </ScrollView>
  );
};

export default StackGuideDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '20%',
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  period: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  point: {
    marginBottom: 15,
  },
  pointTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pointDescription: {
    fontSize: 16,
    color: '#444',
  },
  backButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});