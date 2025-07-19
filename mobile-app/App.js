
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import Intro from './components/Intro';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';


const Stack = createNativeStackNavigator();

export default function App() {


  const [fontsLoaded] = useFonts({
    'Inter-Reg': require('./assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter_18pt-Bold.ttf'),
    'Inter-Light': require('./assets/fonts/Inter_18pt-Light.ttf'),
    'Inter-Semi-Bold': require('./assets/fonts/Inter_18pt-SemiBold.ttf'),
  });

  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup}/>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
    </NavigationContainer>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
});

