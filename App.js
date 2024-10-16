import React,{useEffect, useState,useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {ContextProvider} from './store/context';
import {
  StackArticleDetails,
  StackGameScreen,
  StackGuideDetails,
  StackWelcomeScreen,
} from './screen/Stack';
import {
  TabArticleScreen,
  TabGuideScreen,
  TabMapScreen,
  TabBattleGameScreen,
  TabUserAccount,
} from './screen/Tab';
import {View, Text, StyleSheet,AppState,Platform,Animated} from 'react-native';
import { playBackgroundMusic,resetPlayer } from './components/AppMusic/setupPlayer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FFD700', // Gold color for active tab
        tabBarInactiveTintColor: '#CD7F32', // Bronze color for inactive tab
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({focused, color, size}) => {
          let label;

          if (route.name === 'TabGuideScreen') {
            label = 'G';
          } else if (route.name === 'TabMapScreen') {
            label = 'M';
          } else if (route.name === 'TabArticleScreen') {
            label = 'A';
          } else if (route.name === 'TabUserScreen') {
            label = 'U';
          }

          return (
            <View
              style={[
                styles.iconContainer,
                focused ? styles.activeIcon : null,
              ]}>
              <Text style={[styles.iconText, {color}]}>{label}</Text>
            </View>
          );
        },
      })}>
      <Tab.Screen
        name="TabUserScreen"
        component={TabUserAccount}
        options={{tabBarLabel: 'Account'}}
      />
      <Tab.Screen
        name="TabGuideScreen"
        component={TabGuideScreen}
        options={{tabBarLabel: 'Guides'}}
      />
      <Tab.Screen
        name="TabMapScreen"
        component={TabMapScreen}
        options={{tabBarLabel: 'Map'}}
      />
      <Tab.Screen
        name="TabArticleScreen"
        component={TabArticleScreen}
        options={{tabBarLabel: 'Articles'}}
      />
    </Tab.Navigator>
  );
};

const loaders = [
  require('./assets/image/newDesign/loader1.png'),
  require('./assets/image/newDesign/loader2.png'),
];

function App() {
  const [currentLoader, setCurrentLoader] = useState(0);
  const fadeAnim1 = useRef(new Animated.Value(1)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await playBackgroundMusic();
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    initializePlayer();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        resetPlayer();
      } else if (nextAppState === 'active') {
        playBackgroundMusic();
      }
    });

    return () => {
      subscription.remove();
      resetPlayer();
    };
  }, []);

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      fadeToNextLoader();
    }, 1500); // Start transition after 3 seconds

    const navigationTimeout = setTimeout(() => {
      navigateToMenu();
    }, 4000);

    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(navigationTimeout);
    };
  }, []);

  const fadeToNextLoader = () => {
    Animated.parallel([
      Animated.timing(fadeAnim1, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentLoader(1);
    });
  };

  const navigateToMenu = () => {
    setCurrentLoader(2);
  };

  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 500,
          }}>
            {currentLoader < 2 ? (
            <Stack.Screen name="Welcome" options={{headerShown: false}}>
              {() => (
                <View style={{flex: 1}}>
                  <Animated.Image
                    source={loaders[0]}
                    style={[
                      {width: '100%', height: '100%', position: 'absolute'},
                      {opacity: fadeAnim1},
                    ]}
                  />
                  <Animated.Image
                    source={loaders[1]}
                    style={[
                      {width: '100%', height: '100%', position: 'absolute'},
                      {opacity: fadeAnim2},
                    ]}
                  />
                </View>
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="StackWelcomeScreen" component={StackWelcomeScreen} />
          )}
          {/* <Stack.Screen
            name="StackWelcomeScreen"
            component={StackWelcomeScreen}
          /> */}
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen
            name="StackArticleDetails"
            component={StackArticleDetails}
          />
          <Stack.Screen
            name="StackGuideDetails"
            component={StackGuideDetails}
          />
          <Stack.Screen name="StackGameScreen" component={StackGameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#8B4513', // Saddle Brown color for tab bar background
    borderTopWidth: 2,
    borderTopColor: '#DAA520', // Goldenrod color for top border
    height: 90,
    paddingBottom: 25,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontFamily: 'serif',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#CD7F32', // Bronze color for icon border
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  activeIcon: {
    backgroundColor: '#CD7F32', // Bronze background for active icon
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
});

export default App;
