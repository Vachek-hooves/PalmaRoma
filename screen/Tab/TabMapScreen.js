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
import MapView, {Marker, Callout, Polyline} from 'react-native-maps';
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
  const [routeMarkers, setRouteMarkers] = useState([]);
  const [showRoute, setShowRoute] = useState(false);

  const initialRegion = {
    latitude: 41.9028,
    longitude: 12.4964,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const handleMarkerPress = place => {
    setSelectedPlace(place);
    setRouteMarkers(prev => [...prev, place]);
    setShowRoute(true);
  };

  const handleShowDetails = () => {
    setModalVisible(true);
  };

  const handleMapLongPress = event => {
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
    if (!selectedPlace || !selectedPlace.id) return;

    Alert.alert(
      'Delete Marker',
      'Are you sure you want to delete this marker?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            removeUserMarker(selectedPlace.id);
            setModalVisible(false);
            setSelectedPlace(null);
          },
        },
      ],
    );
  };

  const clearRoute = () => {
    setRouteMarkers([]);
    setShowRoute(false);
  };

  const renderTuristPlaceMarkers = () =>
    turistPlaces.map((place, index) => (
      <Marker
        key={`tourist-${index}`}
        coordinate={{
          latitude: place.coordinates[0],
          longitude: place.coordinates[1],
        }}
        onPress={() => handleMarkerPress({...place, isTouristPlace: true})}>
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
    ));

  const renderUserMarkers = () =>
    userMarkers.map(marker => (
      <Marker
        key={`user-${marker.id}`}
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
    ));

  const renderMarkerImage = image => {
    if (typeof image === 'string' && image.startsWith('data:image')) {
      // It's a base64 image
      return {uri: image};
    } else if (typeof image === 'number') {
      // It's a require('./image.jpg') style import
      return image;
    } else {
      // It might be a uri string
      return {uri: image};
    }
  };

  const renderMarkerDetails = () => {
    if (!selectedPlace) return null;

    const isUserMarker = !selectedPlace.isTouristPlace;

    return (
      <>
        <Text style={styles.modalTitle}>{selectedPlace.header}</Text>
        <Text style={styles.modalDescription}>{selectedPlace.description}</Text>
        {selectedPlace.images &&
          selectedPlace.images.map((image, index) => (
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

  const renderRoute = () => {
    if (showRoute && routeMarkers.length >= 2) {
      const coordinates = routeMarkers.map(marker => ({
        latitude: marker.coordinate
          ? marker.coordinate.latitude
          : marker.coordinates[0],
        longitude: marker.coordinate
          ? marker.coordinate.longitude
          : marker.coordinates[1],
      }));

      return (
        <Polyline
          coordinates={coordinates}
          strokeColor="#FF0000"
          strokeWidth={2}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onLongPress={handleMapLongPress}>
        {renderTuristPlaceMarkers()}
        {renderUserMarkers()}
        {renderRoute()}
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

      {showRoute && (
        <TouchableOpacity style={styles.clearRouteButton} onPress={clearRoute}>
          <Text style={styles.clearRouteButtonText}>Clear Route</Text>
        </TouchableOpacity>
      )}

      {(createMarkerMode || !showRoute || showRoute) && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            {createMarkerMode
              ? 'Long press on the map to add a new marker'
              : !showRoute
              ? 'Tap markers to create a route'
              : `Route: ${routeMarkers.length} points`}
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
                onChangeText={text =>
                  setNewMarker(prev => ({...prev, header: text}))
                }
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                multiline
                value={newMarker?.description || ''}
                onChangeText={text =>
                  setNewMarker(prev => ({...prev, description: text}))
                }
              />
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>Add Image</Text>
              </TouchableOpacity>
              {newMarker?.images &&
                newMarker.images.map((image, index) => (
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
    backgroundColor: '#D2B48C', // Tan color for parchment-like background
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: '#FFEFD5', // Papaya Whip color for callout background
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod border
    borderRadius: 10,
  },
  calloutHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8B4513', // Saddle Brown color for header
    fontFamily: 'serif',
  },
  showButton: {
    backgroundColor: '#CD7F32', // Bronze color for button
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAA520', // Goldenrod border
  },
  showButtonText: {
    color: '#FFF8DC', // Light cream color for text
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(139, 69, 19, 0.5)', // Semi-transparent Saddle Brown
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFEFD5', // Papaya Whip color for modal background
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
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod border
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#8B4513', // Saddle Brown color for title
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'justify',
    color: '#5D4037', // Brown color for description
    fontFamily: 'serif',
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#DAA520', // Goldenrod border
  },
  closeButton: {
    backgroundColor: '#CD7F32', // Bronze color for button
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#DAA520', // Goldenrod border
  },
  closeButtonText: {
    color: '#FFF8DC', // Light cream color for text
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  createMarkerButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#CD7F32', // Bronze color for button
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DAA520', // Goldenrod border
  },
  createMarkerButtonActive: {
    backgroundColor: '#8B4513', // Saddle Brown color for active state
  },
  createMarkerButtonText: {
    color: '#FFF8DC', // Light cream color for text
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DAA520', // Goldenrod border
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#FFF8DC', // Light cream color for input background
    color: '#5D4037', // Brown color for text
    fontFamily: 'serif',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#CD7F32', // Bronze color for button
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DAA520', // Goldenrod border
  },
  imageButtonText: {
    color: '#FFF8DC', // Light cream color for text
    textAlign: 'center',
    fontFamily: 'serif',
  },
  createButton: {
    backgroundColor: '#CD7F32', // Bronze color for button
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#DAA520', // Goldenrod border
  },
  createButtonText: {
    color: '#FFF8DC', // Light cream color for text
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(139, 69, 19, 0.7)', // Semi-transparent Saddle Brown
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DAA520', // Goldenrod border
  },
  instructionText: {
    color: '#FFF8DC', // Light cream color for text
    textAlign: 'center',
    fontFamily: 'serif',
  },
  deleteButton: {
    backgroundColor: '#8B0000', // Dark red color for delete button
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#DAA520', // Goldenrod border
  },
  deleteButtonText: {
    color: '#FFF8DC', // Light cream color for text
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'serif',
    textTransform: 'uppercase',
  },
  clearRouteButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#CD7F32', // Bronze color for button
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DAA520', // Goldenrod border
  },
  clearRouteButtonText: {
    color: '#FFF8DC', // Light cream color for text
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
});