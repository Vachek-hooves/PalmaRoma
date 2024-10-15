import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const BackIcon = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.container}>
      <Image
        source={require('../../assets/image/icon/back.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

export default BackIcon;

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    tintColor: '#FFEFD5',
  },
  container: {
    position: 'absolute',
    top: '15%',
    right: 50,
    zIndex: 10,
  },
});
