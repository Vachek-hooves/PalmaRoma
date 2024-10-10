import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import {turistPlaces} from '../../data/turistPlaces';
import {useCustomContext} from '../../store/context';
import * as ImagePicker from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TabMapScreen = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createMarkerMode, setCreateMarkerMode] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const {userMarkers, addUserMarker, removeUserMarker} = useCustomContext();

  const initialRegion = {
    latitude: 41.9028,
    longitude: 12.4964,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const handleMarkerPress = place => {
    setSelectedPlace(place);
  };

  const handleShowDetails = () => {
    setModalVisible(true);
  };

  const handleMapLongPress = (event) => {
    if (createMarkerMode) {
      const {coordinate} = event.nativeEvent;
      setNewMarker({
        coordinate,
        header: '',
        description: '',
        images: [],
      });
      setCreateModalVisible(true);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const newImage = `data:${result.assets[0].type};base64,${result.assets[0].base64}`;
      setNewMarker(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage],
      }));
    }
  };

  const handleCreateMarker = () => {
    if (newMarker) {
      addUserMarker(newMarker);
      setNewMarker(null);
      setCreateModalVisible(false);
      setCreateMarkerMode(false);
    }
  };

  const handleDeleteMarker = () => {
    Alert.alert(
      "Delete Marker",
      "Are you sure you want to delete this marker?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            if (selectedPlace && selectedPlace.id) {
              removeUserMarker(selectedPlace.id);
              setModalVisible(false);
              setSelectedPlace(null);
            }
          }
        }
      ]
    );
  };

  const renderTuristPlaceMarkers = () => (
    turistPlaces.map((place, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: place.coordinates[0],
          longitude: place.coordinates[1],
        }}
        onPress={() => handleMarkerPress(place)}>
        <Callout>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutHeader}>{place.header}</Text>
            <TouchableOpacity
              style={styles.showButton}
              onPress={handleShowDetails}>
              <Text style={styles.showButtonText}>Show</Text>
            </TouchableOpacity>
          </View>
        </Callout>
      </Marker>
    ))
  );

  const renderUserMarkers = () => (
    userMarkers.map((marker, index) => (
      <Marker
        key={`user-${index}`}
        coordinate={marker.coordinate}
        onPress={() => handleMarkerPress(marker)}>
        <Callout>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutHeader}>{marker.header}</Text>
            <TouchableOpacity
              style={styles.showButton}
              onPress={handleShowDetails}>
              <Text style={styles.showButtonText}>Show</Text>
            </TouchableOpacity>
          </View>
        </Callout>
      </Marker>
    ))
  );

  const renderMarkerImage = (image) => {
    if (typeof image === 'string' && image.startsWith('data:image')) {
      // It's a base64 image
      return { uri: image };
    } else if (typeof image === 'number') {
      // It's a require('./image.jpg') style import
      return image;
    } else {
      // It might be a uri string
      return { uri: image };
    }
  };

  const renderMarkerDetails = () => {
    if (!selectedPlace) return null;

    const isUserMarker = selectedPlace.id !== undefined;

    return (
      <>
        <Text style={styles.modalTitle}>{selectedPlace.header}</Text>
        <Text style={styles.modalDescription}>
          {selectedPlace.description}
        </Text>
        {selectedPlace.images && selectedPlace.images.map((image, index) => (
          <Image
            key={index}
            source={renderMarkerImage(image)}
            style={styles.modalImage}
            resizeMode="cover"
          />
        ))}
        {isUserMarker && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteMarker}>
            <Text style={styles.deleteButtonText}>Delete Marker</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onLongPress={handleMapLongPress}>
        {renderTuristPlaceMarkers()}
        {renderUserMarkers()}
      </MapView>

      <TouchableOpacity
        style={[
          styles.createMarkerButton,
          createMarkerMode && styles.createMarkerButtonActive,
        ]}
        onPress={() => setCreateMarkerMode(!createMarkerMode)}>
        <Text style={styles.createMarkerButtonText}>
          {createMarkerMode ? 'Cancel' : 'Create Marker'}
        </Text>
      </TouchableOpacity>

      {createMarkerMode && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Long press on the map to add a new marker
          </Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {renderMarkerDetails()}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Place Name"
                value={newMarker?.header || ''}
                onChangeText={(text) => setNewMarker(prev => ({...prev, header: text}))}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                multiline
                value={newMarker?.description || ''}
                onChangeText={(text) => setNewMarker(prev => ({...prev, description: text}))}
              />
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>Add Image</Text>
              </TouchableOpacity>
              {newMarker?.images && newMarker.images.map((image, index) => (
                <Image 
                  key={index} 
                  source={renderMarkerImage(image)}
                  style={styles.modalImage} 
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateMarker}>
              <Text style={styles.createButtonText}>Create Marker</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCreateModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TabMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  showButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  showButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'justify',
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '100%',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  createMarkerButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  createMarkerButtonActive: {
    backgroundColor: '#FF5722',
  },
  createMarkerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '100%',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  instructionText: {
    color: 'white',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});