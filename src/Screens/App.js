import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppProvider } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import SavedServicesScreen from './src/screens/SavedServicesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  // Provider sits at the root so all three screens share one state
  return (
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Services" component={ServicesScreen} />
          <Tab.Screen name="Saved" component={SavedServicesScreen} options={{ title: 'Saved Services' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}