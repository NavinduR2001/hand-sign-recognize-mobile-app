import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  BackHandler,
  ImageBackground,
  SafeAreaView,
} from 'react-native';


import { getAuth, signOut } from '@react-native-firebase/auth';
import {
  getFirestore,
  doc,
  getDoc
} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    console.log('🔄 Fetching user data...');
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      try {
        // Updated Firebase v22 modular API
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          const fullName = (data.firstName || '') + ' ' + (data.lastName || '');
          setName(fullName.trim() || 'User Name');
          setMobile(data.mobileNumber || '');
          setProfileImage(data.profileImage || null);
          console.log('✅ User data updated:', {
            name: fullName.trim(),
            mobile: data.mobileNumber,
            hasProfileImage: !!data.profileImage
          });
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchUserData();

   
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, []);

  // Refresh data when screen comes into focus (when returning from Settings)
  useFocusEffect(
    React.useCallback(() => {
      console.log('🎯 Home screen focused, refreshing data...');
      fetchUserData();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Do you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            const auth = getAuth();
            signOut(auth)
              .then(() => navigation.replace('Login'))
              .catch(error => {
                console.error('Logout error:', error);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#154DC6" />
      <ImageBackground
        source={require('../assets/BackGround.png')}
        style={styles.backgroundimg}
        resizeMode="cover"
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={require('../assets/white-logo.png')}
                style={styles.logo}
              />
              <Text style={styles.headerText}>WaveWords</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
              <Icon name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/Defalt-profile.png')
              }
              style={styles.avatar}
              key={profileImage} // Force re-render when image URL changes
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{name || 'User Name'}</Text>
              <Text style={styles.phone}>{mobile || 'Phone Number'}</Text>
            </View>
          </View>

          {/* Menu Grid */}
          <View style={styles.grid}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('AddContact')}
            >
              <View style={styles.iconCircle}>
                <Icon name="person-add-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.menuText}>Add Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Contacts')}
            >
              <View style={styles.iconCircle}>
                <Icon name="people-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.menuText}>Contacts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('RecentCall')}
            >
              <View style={styles.iconCircle}>
                <Icon name="time-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.menuText}>Recent Calls</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Setting')}
            >
              <View style={styles.iconCircle}>
                <Icon name="cog-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out-outline" size={22} color="#fff" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 WaveWords. All rights reserved.</Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundimg: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileCard: {
    padding: 10,
    marginTop: 0,
    width: '90%',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    marginTop: 15,
    alignItems: 'center',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  phone: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 30,
  },
  menuItem: {
    backgroundColor: 'rgba(66, 133, 244, 0.9)',
    width: '48%',
    height: 130,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutIcon: {
    marginRight: 10,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 10,
  },
});

export default Home;
