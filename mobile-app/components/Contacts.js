import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  StatusBar, TouchableOpacity, ActivityIndicator, Image,
  Alert, ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Updated Firebase imports
import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import VideoCallModal from '../components/VideoCallModal';

export default function Contacts({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [activeCall, setActiveCall] = useState({
    callId: null,
    contactName: null,
  });

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigation.replace('Login');
      return;
    }

    // Updated Firebase v22 modular API
    const firestore = getFirestore();
    const contactsRef = collection(firestore, 'users', currentUser.uid, 'contacts');
    const q = query(contactsRef, orderBy('contactName'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const contactsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContacts(contactsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigation]);

  // Update handleVideoCall to create the document before opening modal

  const handleVideoCall = async (contact) => {
    try {
      const auth = getAuth();
      const currentUserId = auth.currentUser.uid;

      if (!contact.contactUserId) {
        Alert.alert('Error', 'This contact does not have a valid user ID');
        return;
      }

      // Generate a call ID
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const newCallId = `call_${timestamp}_${randomSuffix}`;
      
      console.log('📞 Creating new call with ID:', newCallId);

      // Get caller information first
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'users', currentUserId);
      const userDoc = await getDoc(userDocRef);

      let callerName = 'Unknown Caller';
      if (userDoc.exists()) {
        const userData = userDoc.data();
        callerName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown Caller';
      }

      // Create the call document BEFORE opening the modal
      const callDocRef = doc(firestore, 'calls', newCallId);
      await setDoc(callDocRef, {
        callerId: currentUserId,
        receiverId: contact.contactUserId,
        callerName: callerName,
        status: 'ringing',
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp(),
        type: 'video',
        active: true,
      });

      console.log('📞 Call document created in Contacts.js:', newCallId);

      // Update state with call info including contactUserId
      setActiveCall({
        callId: newCallId,
        contactName: contact.contactName,
        contactUserId: contact.contactUserId,
      });

      // Show modal
      setShowVideoCall(true);
    } catch (error) {
      console.error('Error initiating video call:', error);
      Alert.alert('Call Error', 'Failed to start video call');
    }
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ContactDetail', { contactId: item.id })}
    >
      {/* Profile Picture or Avatar */}
      {item.profilePicture ? (
        <Image
          source={{ uri: item.profilePicture }}
          style={styles.profilePicture}
          defaultSource={require('../assets/Defalt-profile.png')}
        />
      ) : (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.contactName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.contactName}</Text>
        <Text style={styles.contactNumber}>{item.mobileNumber}</Text>
      </View>

      <TouchableOpacity
        style={styles.videoCallButton}
        onPress={() => handleVideoCall(item)}
      >
        <Icon name="videocam" size={24} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
            <Text style={styles.topic}>My Contacts</Text>
          </View>

          <View style={styles.contentContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.loadingText}>Loading contacts...</Text>
              </View>
            ) : contacts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="people-outline" size={60} color="white" />
                <Text style={styles.emptyText}>No contacts yet</Text>
                <Text style={styles.emptySubText}>
                  Add contacts to start chatting
                </Text>
              </View>
            ) : (
              <FlatList
                data={contacts}
                renderItem={renderContact}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddContact')}
          >
            <Icon name="add" size={30} color="white" />
          </TouchableOpacity>

          {/* Video Call Modal */}
          {showVideoCall && activeCall && (
            <VideoCallModal
              isVisible={showVideoCall}
              callId={activeCall.callId}
              contactName={activeCall.contactName}
              contactUserId={activeCall.contactUserId} // Add this prop
              isIncoming={false}
              onClose={() => {
                setShowVideoCall(false);
                setActiveCall(null);
              }}
            />
          )}
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  contactNumber: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  videoCallButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(66, 133, 244, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
});
