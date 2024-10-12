import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions, Modal, TextInput, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { turistPlaces } from '../../data/turistPlaces';
import AppLayout from '../../components/Layout/AppLayout';
import { useCustomContext } from '../../store/context';

const { width } = Dimensions.get('window');

const TabArticleScreen = ({ navigation }) => {
  const { userArticles, addUserArticle } = useCustomContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [newArticle, setNewArticle] = useState({ header: '', description: '', images: [] });

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.articleContainer}
      onPress={() => navigation.navigate('StackArticleDetails', { article: item })}
    >
      {renderArticleImage(item)}
      <View style={styles.textContainer}>
        <Text style={styles.header}>{item.header}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderArticleImage = (item) => {
    if (item.images && item.images.length > 0) {
      if (typeof item.images[0] === 'string') {
        // User-created article image
        return <Image source={{ uri: item.images[0] }} style={styles.image} />;
      } else {
        // TuristPlaces article image
        return <Image source={item.images[0]} style={styles.image} />;
      }
    } else {
      // Default image if no image is available
      return <Image source={require('../../assets/image/defaultImage.png')} style={styles.image} />;
    }
  };

  const handleAddImage = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setNewArticle(prevArticle => ({
          ...prevArticle,
          images: [...prevArticle.images, source.uri]
        }));
      }
    });
  };

  const handleAddArticle = () => {
    if (newArticle.header && newArticle.description) {
      addUserArticle(newArticle);
      setNewArticle({ header: '', description: '', images: [] });
      setModalVisible(false);
    }
  };

  return (
    <AppLayout>
      <Text style={styles.title}>Discover Rome</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Article</Text>
      </TouchableOpacity>
      <FlatList
        data={[...userArticles, ...turistPlaces]}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add New Article</Text>
              <TextInput
                style={styles.input}
                placeholder="Article Title"
                placeholderTextColor="#8B4513"
                value={newArticle.header}
                onChangeText={(text) => setNewArticle({...newArticle, header: text})}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Article Description"
                placeholderTextColor="#8B4513"
                multiline
                numberOfLines={4}
                value={newArticle.description}
                onChangeText={(text) => setNewArticle({...newArticle, description: text})}
              />
              <TouchableOpacity style={styles.imageButton} onPress={handleAddImage}>
                <Text style={styles.imageButtonText}>Add Image</Text>
              </TouchableOpacity>
              {newArticle.images.length > 0 && (
                <Text style={styles.imageAddedText}>{newArticle.images.length} image(s) added</Text>
              )}
              <TouchableOpacity style={styles.submitButton} onPress={handleAddArticle}>
                <Text style={styles.submitButtonText}>Submit Article</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </AppLayout>
  );
};

export default TabArticleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#D2B48C', // Tan color for parchment-like background
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DAA520', // Saddle Brown color for title
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
  addButton: {
    backgroundColor: '#CD7F32',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  addButtonText: {
    color: '#FFF8DC',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#FFEFD5',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 15,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CD7F32',
    borderRadius: 5,
    color: '#8B4513',
    fontFamily: 'serif',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#CD7F32',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  submitButtonText: {
    color: '#FFF8DC',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  cancelButton: {
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF8DC',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  imageButton: {
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  imageButtonText: {
    color: '#FFF8DC',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  imageAddedText: {
    color: '#8B4513',
    fontSize: 14,
    fontFamily: 'serif',
    textAlign: 'center',
    marginTop: 5,
  },
});
