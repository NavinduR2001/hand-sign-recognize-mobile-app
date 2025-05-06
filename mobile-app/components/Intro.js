import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, ImageBackground, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Intro({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {

    // Show logo after 2 seconds
    const logoTimer = setTimeout(() => {
      setShowLogo(true);

      // Animate logo scale
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    }, 2000);

    // Navigate to Login after 4 seconds
    const navTimer = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(navTimer);
    };
  }, []);

  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="#154DC6" />
    <ImageBackground
      source={require('../assets/BackGround.png')} 
      style={styles.background}
    >
      {showLogo && (
        <Animated.Image
          source={require('../assets/white-logo.png')}
          style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
        />
      )}
    </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
