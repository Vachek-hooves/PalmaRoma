import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const StackArticleDetails = ({ route }) => {
    const { article } = route.params;

    return (
      <ScrollView style={styles.container}>
        <Image source={article.images[0]} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.header}>{article.header}</Text>
          <Text style={styles.description}>{article.description}</Text>
        </View>
      </ScrollView>
    );
};

export default StackArticleDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C', // Tan color for parchment-like background
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
    borderBottomWidth: 3,
    borderBottomColor: '#DAA520', // Goldenrod border
  },
  content: {
    padding: 20,
    backgroundColor: '#FFEFD5', // Papaya Whip color for content background
    borderRadius: 15,
    margin: 15,
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod border
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color for header
    marginBottom: 20,
    fontFamily: 'serif',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#5D4037', // Brown color for description
    lineHeight: 28,
    fontFamily: 'serif',
  },
});
