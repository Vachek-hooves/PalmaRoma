import React from 'react';
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
import {View, Text, StyleSheet} from 'react-native';

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
      <Tab.Screen name="TabUserScreen" component={TabUserAccount} />
    </Tab.Navigator>
  );
};

function App() {
  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 500,
          }}>
          <Stack.Screen
            name="StackWelcomeScreen"
            component={StackWelcomeScreen}
          />
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
