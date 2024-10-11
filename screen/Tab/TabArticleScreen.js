import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { turistPlaces } from '../../data/turistPlaces';

const { width } = Dimensions.get('window');

const TabArticleScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.articleContainer}
      onPress={() => navigation.navigate('StackArticleDetails', { article: item })}
    >
      <Image source={item.images[0]} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.header}>{item.header}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Rome</Text>
      <FlatList
        data={turistPlaces}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TabArticleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2B48C', // Tan color for parchment-like background
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color for title
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  articleContainer: {
    backgroundColor: '#FFEFD5', // Papaya Whip color for article background
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod border
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513', // Saddle Brown color for header
    marginBottom: 10,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: '#5D4037', // Brown color for description
    lineHeight: 24,
    fontFamily: 'serif',
  },
});