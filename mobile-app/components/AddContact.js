import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Updated Firebase imports - Modular API
import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from '@react-native-firebase/firestore';

export default function AddContact({ navigation }) {
  const [contactName, setContactName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddContact = async () => {
    // Validate input fields
    if (!contactName.trim()) {
      Alert.alert('Validation Error', 'Please enter contact name');
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    try {
      // Get current user ID using modular API
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get Firestore instance
      const firestore = getFirestore();

      // Check if the mobile number exists in the users collection
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('mobileNumber', '==', mobileNumber));
      const userSnapshot = await getDocs(q);

      // If mobile number not registered
      if (userSnapshot.empty) {
        setLoading(false);
        Alert.alert(
          'User Not Found',
          'This mobile number is not registered in WaveWords.'
        );
        return;
      }

      // Get the contact's user ID
      const contactUserDoc = userSnapshot.docs[0];
      const contactUserId = contactUserDoc.id;
      const contactUserData = contactUserDoc.data();

      // Check if trying to add self as contact
      if (contactUserId === currentUser.uid) {
        setLoading(false);
        Alert.alert('Cannot Add', 'You cannot add yourself as a contact');
        return;
      }

      // Check if contact already exists
      const contactsRef = collection(firestore, 'users', currentUser.uid, 'contacts');
      const existingContactQuery = query(contactsRef, where('contactUserId', '==', contactUserId));
      const existingContactSnapshot = await getDocs(existingContactQuery);

      if (!existingContactSnapshot.empty) {
        setLoading(false);
        Alert.alert('Contact Exists', 'This contact is already in your contacts list');
        return;
      }

      // Add the contact using modular API
      await addDoc(contactsRef, {
        contactName: contactName,
        mobileNumber: mobileNumber,
        contactUserId: contactUserId,
        firstName: contactUserData.firstName || '',
        lastName: contactUserData.lastName || '',
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      Alert.alert('Success', 'Contact added successfully');

      // Clear the form fields
      setContactName('');
      setMobileNumber('');

      // Navigate back or to contacts list
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error('Error adding contact:', error);
      Alert.alert('Error', error.message || 'Failed to add contact');
    }
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-circle" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.topic}>Add Contact</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <Icon name="person-add" size={60} color="#ffffff" style={styles.formIcon} />
              <Text style={styles.formTitle}>New Contact</Text>

              <View style={styles.inputfieldContainer}>
                <Icon name="person-outline" size={18} color="#4285F4" style={styles.icon} />
                <TextInput
                  style={styles.inputText}
                  placeholder="Contact Name"
                  value={contactName}
                  onChangeText={setContactName}
                  placeholderTextColor="#4285F4"
                />
              </View>

              <View style={styles.inputfieldContainer}>
                <Icon name="call-outline" size={18} color="#4285F4" style={styles.icon} />
                <TextInput
                  style={styles.inputText}
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholderTextColor="#4285F4"
                  maxLength={10}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleAddContact}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Icon name="add-circle-outline" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>ADD CONTACT</Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.infoText}>
                <Icon name="information-circle-outline" size={14} color="#ffffffff"/>Only registered WaveWords users can be added as contacts !
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

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
  },
  header: {
    width: '100%',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  back: {
    marginRight: 10,
  },
  topic: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    borderRadius: 15,
    padding: 0,
    width: '100%',
    alignItems: 'center',
  },
  formIcon: {
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  inputfieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    width: '100%',
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingRight: 10,
    elevation: 3,
    height: 45,
    paddingHorizontal: 10,
  },
  icon: {
    marginLeft: 10,
  },
  inputText: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: '#154DC6', // Changed to dark blue for better visibility on white background
  },
  button: {
    backgroundColor: '#4285F4',
    width: '100%',
    marginTop: 25,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 45,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});
