import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { db } from "../firebase";
import { collection, addDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function AddMemberScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");

  const handleAddMember = async () => {
  if (firstName && lastName && mobileNumber) {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("mobile_number", "==", mobileNumber)
      );
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        setError("This user is not registered in WaveWords.");
        return;
      }

      const contactQuery = query(
        collection(db, "contacts"),
        where("mobileNumber", "==", mobileNumber)
      );
      const contactSnapshot = await getDocs(contactQuery);

      if (!contactSnapshot.empty) {
        setError("This phone number is already added to contacts.");
        return;
      }

      const docRef = await addDoc(collection(db, "contacts"), {
        firstName,
        lastName,
        mobileNumber,
      });

      await updateDoc(docRef, {
        contactId: docRef.id,
      });

      setFirstName("");
      setLastName("");
      setMobileNumber("");
      setError("");
      navigation.navigate("ContactList");

    } catch (error) {
      console.error("Error adding member: ", error);
      setError("An unexpected error occurred.");
    }
  } else {
    setError("All fields are required.");
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-circle-outline" size={28} color="#1E4BD9" />
            </TouchableOpacity>

            <Image
              source={require("../assets/Rectangle7.png")}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.title}>Add Member</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput
              placeholder="Enter First Name"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter Last Name"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.button} onPress={handleAddMember}>
              <Text style={styles.buttonText}>Add to Contact</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    flexGrow: 1,
  },
  backIcon: {
    alignSelf: "flex-start",
  },
  image: {
    width: 300,
    height: 200,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#154DC6",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#1E4BD9",
    padding: 12,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1E4BD9",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});
