import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function ContactListScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "contacts"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(list);
    });

    return unsubscribe;
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || contact.mobileNumber.includes(query);
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Text style={styles.headerText}>waveword</Text>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Contacts</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name..."
        placeholderTextColor="#999"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      {/* Contact List */}
      <View style={styles.contactListBox}>
        <ScrollView contentContainerStyle={styles.contactListScroll}>
          {filteredContacts.map((contact) => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactRow}>
                <View>
                  <Text style={styles.contactName}>
                    {contact.firstName} {contact.lastName}
                  </Text>
                  <Text style={styles.contactNumber}>{contact.mobileNumber}</Text>
                </View>
                <Ionicons name="videocam" size={24} color="#fff" />
              </View>
              <View style={styles.horizontalLine} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: "#1E4BD9",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 20,
  },
  logo: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E4BD9",
    margin: 16,
    marginTop: 20,
  },
  searchInput: {
  height: 45,
  borderColor: "#3D7DFF",   
  borderWidth: 1.5,
  borderRadius: 12,
  marginHorizontal: 16,
  paddingHorizontal: 12,
  marginBottom: 10,
  backgroundColor: "#f0f6ff", 
  color: "#333",
  fontSize: 16,
  },
  contactListBox: {
    flex: 1,
    backgroundColor: "#4285F4",
    borderRadius: 30,
    marginTop: 10,
  },
  contactListScroll: {
    padding: 35,
  },
  contactItem: {
    backgroundColor: "#3D7DFF",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  contactNumber: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 4,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginTop: 10,
  },
});
