import {StyleSheet, Text, View, ImageBackground, SafeAreaView} from 'react-native';

const AppLayout = ({children}) => {
  return (
    <ImageBackground
      source={require('../../assets/image/bg/coliseum.jpg')}
      style={styles.container}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
      </View>
    </ImageBackground>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(139, 69, 19, 0.6)', 
    width: '100%',
    paddingHorizontal: 10,
  },
  safeArea: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // justifyContent:'flex-end'
  },
});
