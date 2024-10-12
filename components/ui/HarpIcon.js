import {useEffect, useRef} from 'react';
import {StyleSheet, View, Image, Animated} from 'react-native';

const HarpIcon = ({isPlay}) => {
  return (
    <View style={[styles.harpContainer,{backgroundColor: isPlay?'#DAA520':'#FFEFD5'}]}>
      <Image
        source={require('../../assets/image/sound/harp.png')}
        style={{width: 90, height: 90,}}
      />
    </View>
  );
};

export default HarpIcon;

const styles = StyleSheet.create({
  harpContainer: { borderRadius: 50,padding:5},
});
