import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useState} from 'react';
import {State, usePlaybackState} from 'react-native-track-player';
import {toggleBackgroundMusic} from './setupPlayer';
import HarpIcon from '../ui/HarpIcon';

const SoundControl = () => {
  const [playSound, setPlaySound] = useState(false);
  const playbackState = usePlaybackState();
  const isPlaying = playbackState === State.Playing;

  const soundToggleControl = async () => {
    await toggleBackgroundMusic();
    setPlaySound(prev => !prev);
    console.log(playSound)
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={soundToggleControl}>
        {playSound ? (
          <HarpIcon isPlay={playSound} />
        ) : (
          <HarpIcon isPlay={playSound} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SoundControl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    top: 60,
    right: 80,
  },
});
