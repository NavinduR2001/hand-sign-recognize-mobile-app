import {
  View, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView, Platform,
  Image, TextInput, Switch
} from "react-native";
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { updateProfile, updatePassword, signOut } from "firebase/auth";
import propic from "../assets/profilepic.jpg";


const SettingScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [photoURL, setPhotoURL] = useState(user?.photoURL || null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);



  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.backicon} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back-circle" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.topic}>Setting</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.card}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.profilePicArea}>
            <Image
              source={photoURL ? { uri: photoURL } : propic}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.proPicEditIcon}>
              <View style={styles.iconWrapper}>
                <Icon name="create-outline" size={20} color="black" />
              </View>
            </TouchableOpacity>
          </View >
          <View style={styles.textArea}>
            <Text style={styles.sectionTitle}>Change user Name:</Text>
            <TextInput style={styles.input} placeholder="Enter First Name" />
            <Text style={styles.sectionTitle}>Change Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder='New Password'
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder='Confirm Password'
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Notification</Text>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Call Notification</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>
            <View style={styles.buttonArea}>
            <TouchableOpacity style={styles.saveButton} >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  navbar: {
    flex: 0.12,
    backgroundColor: "#154DC6",
  },
  backicon: {
    marginTop: 48,
    marginLeft: 30,
  },
  topic: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 70,
    marginTop: -30,
  },
  card: {

    marginTop: 0,
    // backgroundColor: "#4285F4",
    paddingHorizontal: 20,
  },
  profilePicArea: {
    // backgroundColor: "#cced8a",
    height: 170,
    alignItems: "center",
    paddingTop: 30,
    // justifyContent:"center",


  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "#ffe",
    borderWidth: 2, // Adjust thickness as needed
    borderColor: "#ffff", // White border
  },

  proPicEditIcon: {
    marginTop: -43,
    marginLeft: 10,
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    backgroundColor: "#ccc", // optional background
    justifyContent: "center",
    alignItems: "center",
  },
  textArea: {
    // backgroundColor: "#eba134",
    height: 500,
    paddingHorizontal: 20,
    paddingTop:40,

  },
  label: {
    marginBottom: 5,
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },
  input: {
    borderColor: '#4285F4',
    borderWidth: 2,
    width: '100%',
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    height: 40,
  },
  sectionTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#4285F4',
    borderWidth: 2,
    width: '100%',
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    padding: 5,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonArea:{
    paddingTop:15,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  saveButton: {
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#66ebed",
    borderRadius: 12,
    padding: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

});
