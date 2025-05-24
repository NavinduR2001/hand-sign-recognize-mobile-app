import { useRouter } from 'expo-router';
import { addDoc, collection, DocumentData, onSnapshot, QuerySnapshot, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CallItem from '../components/callItem';
import { db } from '../firebaseConfig';

type Call = {
  id: string;
  name: string;
  time: Date;
  image: any;
};

export default function HomeScreen() {
  const [callData, setCallData] = useState<Call[]>([
    { id: '1', name: 'Mikael', time: new Date(), image: require('../assets/profile2.png') },
  ]);
  const router = useRouter();

  useEffect(() => {
    if (!db) {
      console.error('Firestore instance is undefined!');
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'calls'), (snapshot: QuerySnapshot<DocumentData>) => {
      const calls: Call[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const timeObj = data.time?.seconds ? new Date(data.time.seconds * 1000) : new Date();
        return {
          id: doc.id,
          name: data.name,
          time: timeObj,
          image: require('../assets/profile2.png'),
        };
      });

      // Sort by time descending (latest first)
      const sorted = calls.sort((a, b) => b.time.getTime() - a.time.getTime());
      setCallData(sorted);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  const handleNewCall = async () => {
    const newCall: Call = {
      id: Date.now().toString(),
      name: 'New Contact',
      time: new Date(),
      image: require('../assets/profile2.png'),
    };

    setCallData((prev) => [newCall, ...prev]);

    try {
      await addDoc(collection(db, 'calls'), {
        name: 'New Contact',
        time: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0057D9" />
      <View style={styles.header}>
        <Text style={styles.title}>WaveWords</Text>
      </View>
      <Text style={styles.recentLabel}>Recent Calls</Text>
      <FlatList
        data={callData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CallItem
            name={item.name}
            time={item.time.toLocaleTimeString()} // formatting for display only
            image={item.image}
          />
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleNewCall}>
        <Text style={styles.addButtonText}>+ Simulate Call</Text>
      </TouchableOpacity>
      <View style={styles.newCallButton}>
        <Button title="New Call" onPress={() => router.push('/new-call')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: {
    backgroundColor: '#0057D9',
    padding: 20,
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  recentLabel: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  addButton: {
    backgroundColor: '#0057D9',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  newCallButton: {
    margin: 10,
    marginBottom: 30,
  },
});
