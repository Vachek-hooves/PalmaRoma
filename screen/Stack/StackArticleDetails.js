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
  const { article } = route.params || {};

  if (!article) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  const renderImage = () => {
    if (article.images && article.images.length > 0) {
      if (typeof article.images[0] === 'string') {
        // User-created article image
        return <Image source={{ uri: article.images[0] }} style={styles.image} />;
      } else {
        // TuristPlaces article image
        return <Image source={article.images[0]} style={styles.image} />;
      }
    } else {
      return (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No image available</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderImage()}
      <View style={styles.contentContainer}>
        <Text style={styles.header}>{article.header}</Text>
        <Text style={styles.description}>{article.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C', // Tan color for parchment-like background
  },
  image: {
    width: width,
    height: width * 0.6,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: width,
    height: width * 0.6,
    backgroundColor: '#CD7F32', // Bronze color
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFF8DC', // Light cream color
    fontSize: 18,
    fontFamily: 'serif',
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#FFEFD5', // Papaya Whip color
    borderTopWidth: 2,
    borderTopColor: '#DAA520', // Goldenrod border
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color
    marginBottom: 10,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: '#5D4037', // Brown color
    lineHeight: 24,
    fontFamily: 'serif',
  },
  errorText: {
    fontSize: 18,
    color: '#8B4513', // Saddle Brown color
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'serif',
  },
});

export default StackArticleDetails;
