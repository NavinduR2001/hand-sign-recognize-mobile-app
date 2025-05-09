import React, {useState} from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar, SafeAreaView, ScrollView,Platform,KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, db } from './../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

export default function Signup() {
  const navigation = useNavigation();
  //database work
  const [firstName,setfirstName]=useState("")
  const [lastName,setlastName]=useState("")
  const [mobileNumber,setmobileNumber]=useState("")
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  

 //Confirm password
  const handleSignup = async() => {

    //empty validation
  if (!firstName || !lastName || !mobileNumber || !password || !confirmPassword) {
  Alert.alert("All fields are required!");
  return;
}

  if (mobileNumber.length !== 10) {
  Alert.alert("Invalid Mobile Number!");
  return;}

  if (!/^\d+$/.test(mobileNumber)) {
  Alert.alert("Mobile Number must contain only digits.");
  return;
}

  if (password !== confirmPassword) {
    Alert.alert("Passwords do not match!");
    return;
  }

const fakeEmail = `${mobileNumber}@wavewords.com`;

// 
 try {
      await createUserWithEmailAndPassword(auth, fakeEmail, password);
      await addDoc(collection(db, "users"), {
        first_name: firstName,
        last_name: lastName,
        mobile_number: mobileNumber
      });
      Alert.alert('Successfully Registered!');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      Alert.alert('Signup Error', 'Passwords must be at least 8 characters long and include at least one number and one special symbol (e.g., @, #, $, %, etc.).');
    }
  
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#154DC6" />

       <View style={styles.container}>

        <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('Login')}>
        <Icon name="arrow-back-circle" size={30} color="white" />
        </TouchableOpacity>
          <Text style={styles.topic}>Create Account</Text>
        </View>

        <KeyboardAvoidingView
            style={{ flex: 1, width: '100%', paddingBlockStart: 0, }}
            behavior='padding'>
                
        <ScrollView contentContainerStyle={styles.foamContainer} showsVerticalScrollIndicator={false}>
          <Image source={require('../assets/full.png')} style={styles.image} />
          
          <View style={styles.inputfieldContainer}>
          <Icon name="person-outline" size={18} color="#4285F4" style={styles.icon} />
          <TextInput  style={styles.inputText} placeholder="Enter First Name"
          value={firstName}
          onChangeText={(text)=>setfirstName(text)} 
          placeholderTextColor="#4285F4"/>
          </View> 

<View style={styles.inputfieldContainer}>
          <Icon name="person-outline" size={18} color="#4285F4" style={styles.icon} />
          <TextInput  style={styles.inputText} 
          placeholder="Enter Last Name" 
          value={lastName}
          onChangeText={(text)=>setlastName(text)}
          placeholderTextColor="#4285F4"/>
</View>

<View style={styles.inputfieldContainer}>
          <Icon name="call-outline" size={18} color="#4285F4" style={styles.icon} />
          <TextInput  style={styles.inputText}  placeholder="Enter Mobile Number"
          value={mobileNumber}
          onChangeText={(text)=>setmobileNumber(text)}
          placeholderTextColor="#4285F4" 
          />
</View>
      

        <View style={styles.passwordContainer}>
     <Icon name="lock-closed-outline" size={18} color="#4285F4" style={styles.icon} />
            <TextInput
            style={styles.inputText}
            placeholder='Enter Password'
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#4285F4"
            />
             <View style={styles.infopss}>
          <TouchableOpacity onPress={() => Alert.alert('Password Rule', 'Your password must be at least 8 characters long and include at least one number and one special symbol (e.g., @, #, $, %, etc.).')}>
          <Icon name="information-circle-outline" size={18} color="#4285F4" />
          </TouchableOpacity>
          </View>
            {password.length > 0 && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#4285F4" />
            </TouchableOpacity>
             )}
            </View>

            <View style={styles.passwordContainer}>
              <Icon name="lock-closed-outline" size={18} color="#4285F4" style={styles.icon} />
            <TextInput
             style={styles.inputText}
            placeholder='Confirm Password'
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#4285F4"
            />
            {confirmPassword.length > 0 && (
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#4285F4" />
            </TouchableOpacity>
              )}
        </View>


          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttontext}>CREATE ACCOUNT</Text>
          </TouchableOpacity>

          <Text style={styles.text}>
            Do you have an account, <Text style={styles.bold}>Sign in</Text> Now!
          </Text>

          <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttontext}>LOGIN</Text>
          </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor:'#fbfbfb',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      },
      container: {
        flex: 1,
       
      },
      header: {
        width: '100%',
        backgroundColor: '#154DC6',
        paddingVertical: 10,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:30,
        
      },
      topic: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginLeft:10,
      },
      foamContainer: {
        alignItems: 'center',
        padding: 30,
      },
      image: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 0,
      },
      inputfieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#4285F4',
        borderWidth: 1,
        width: '100%',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'white',
          paddingHorizontal: 10,
  height: 45,
        elevation: 5,
},
inputText:{
    flex: 1,
  paddingLeft: 10,
        fontSize:16,
        color: '#154DC6',
},
      button: {
        backgroundColor: '#4285F4',
        width: '100%',
        marginTop: 20,
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
      },
      button2: {
        backgroundColor: '#4285F4',
        width: '100%',
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
      },
      buttontext: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
      text: {
        fontSize: 14,
        color: 'black',
        marginTop: 10,
      },
      bold: {
        fontWeight: 'bold',
      },

      passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#4285F4',
        borderWidth: 1,
        width: '100%',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        paddingRight: 10,
        height:45,
        elevation: 3,
        paddingHorizontal: 10,
      },
      passwordInput: {
        flex: 1,
        padding: 10,
      },
      eyeIcon: {
        padding: 5,
      },
      infopss:{
        alignItems:'baseline'
      },
      icon: {
      marginLeft: 10,}

    });