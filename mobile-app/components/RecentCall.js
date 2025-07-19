import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  StatusBar, TouchableOpacity, ActivityIndicator,
  Alert, ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
} from '@react-native-firebase/firestore';

export default function RecentCall({ navigation }) {
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigation.replace('Login');
      return;
    }

    const firestore = getFirestore();
    const recentCallsRef = collection(firestore, 'users', currentUser.uid, 'recentCalls');
    const q = query(recentCallsRef, orderBy('timestamp', 'desc'), limit(50));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const callsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentCalls(callsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching recent calls:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigation]);

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCallIcon = (type) => {
    switch (type) {
      case 'incoming':
        return { name: 'call-outline', color: '#4CAF50' };
      case 'outgoing':
        return { name: 'call-outline', color: '#2196F3' };
      case 'missed':
        return { name: 'call-outline', color: '#f44336' };
      default:
        return { name: 'call-outline', color: '#666' };
    }
  };

  const renderCall = ({ item }) => {
    const icon = getCallIcon(item.type);
    
    return (
      <TouchableOpacity style={styles.callItem}>
        <View style={[styles.callIcon, { backgroundColor: icon.color }]}>
          <Icon name={icon.name} size={20} color="white" />
        </View>
        
        <View style={styles.callInfo}>
          <Text style={styles.contactName}>{item.contactName || 'Unknown'}</Text>
          <View style={styles.callDetails}>
            <Text style={styles.callType}>
              {item.type === 'incoming' ? 'Incoming' : 
               item.type === 'outgoing' ? 'Outgoing' : 'Missed'}
            </Text>
            <Text style={styles.callDuration}>
              {item.duration > 0 ? formatDuration(item.duration) : ''}
            </Text>
          </View>
        </View>
        
        <Text style={styles.callTime}>{formatTime(item.timestamp)}</Text>
      </TouchableOpacity>
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-circle" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.topic}>Recent Calls</Text>
          </View>

          <View style={styles.contentContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.loadingText}>Loading recent calls...</Text>
              </View>
            ) : recentCalls.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="time-outline" size={60} color="white" />
                <Text style={styles.emptyText}>No recent calls</Text>
                <Text style={styles.emptySubText}>Your call history will appear here</Text>
              </View>
            ) : (
              <FlatList
                data={recentCalls}
                renderItem={renderCall}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
              />
            )}
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
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  callIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  callInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  callDetails: {
    flexDirection: 'row',
    marginTop: 2,
  },
  callType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 10,
  },
  callDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  callTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});