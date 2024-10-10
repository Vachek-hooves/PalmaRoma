import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {ContextProvider} from './store/context';
import {StackArticleDetails, StackWelcomeScreen} from './screen/Stack';
import {TabArticleScreen, TabMapScreen} from './screen/Tab';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="TabMapScreen" component={TabMapScreen} />
      <Tab.Screen name="TabArticleScreen" component={TabArticleScreen} />
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
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}

export default App;
