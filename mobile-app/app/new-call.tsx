// app/new-call.tsx
import { useRouter } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '../firebaseConfig';


export default function NewCall() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleCall = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name or number");
      return;
    }

    try {
      await addDoc(collection(db, 'calls'), {
        name,
        time: Timestamp.now(),
      });

      Alert.alert("Calling...", `${name}`);
      router.replace('/'); // navigate back to home or recent calls screen
    } catch (error) {
      console.error("Error adding call: ", error);
      Alert.alert("Error", "Failed to make the call.");
    }
  };

  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <Text style={localStyles.title}>WaveWords</Text>
      </View>
      <Text style={localStyles.Label}>New Calls</Text>
      <ScrollView contentContainerStyle={localStyles.content}>
        <Text style={localStyles.heading}>Dial New Call</Text>
        <TextInput
          placeholder="Enter name or number"
          value={name}
          onChangeText={setName}
          style={localStyles.input}
        />
        <View style={localStyles.CallButton}>
         <Button title="Call" onPress={handleCall} />
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
    backgroundColor: '#0057D9',
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  recentLabel: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  Label: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold',
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,paddingRight:50, paddingLeft:50, marginBottom: 20, borderRadius: 8,
  },
  CallButton: {
    width: 80,
  }
});
