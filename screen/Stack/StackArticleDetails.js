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
    backgroundColor: '#fff',
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});
