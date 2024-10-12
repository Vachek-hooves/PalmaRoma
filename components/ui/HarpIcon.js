import React from 'react';
import {StyleSheet, View, Image, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Calculate sizes based on the smaller dimension of the screen
const SCREEN_SMALLER_DIMENSION = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);

// Icon size is now 10% of the smaller screen dimension
const ICON_SIZE = SCREEN_SMALLER_DIMENSION * 0.15;
const CONTAINER_SIZE = ICON_SIZE * 1.2; // 20% larger than the icon

const HarpIcon = ({isPlay}) => {
  return (
    <View 
      style={[
        styles.harpContainer,
        { 
          backgroundColor: isPlay ? '#DAA520' : '#FFEFD5',
          width: CONTAINER_SIZE,
          height: CONTAINER_SIZE,
          borderRadius: CONTAINER_SIZE / 2,
        }
      ]}
    >
      <Image
        source={require('../../assets/image/sound/harp.png')}
        style={[styles.harpImage, { width: ICON_SIZE, height: ICON_SIZE }]}
        resizeMode="contain"
      />
    </View>
  );
};

export default HarpIcon;

const styles = StyleSheet.create({
  harpContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderWidth: 2,
    borderColor: '#CD7F32', // Bronze color for border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
  },
  harpImage: {
    // width and height are now set dynamically in the component
  },
});
