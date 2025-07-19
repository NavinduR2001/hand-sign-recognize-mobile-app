import React, {useState} from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar, SafeAreaView, ScrollView,Platform,KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Signup() {
  const navigation = useNavigation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          
          <TextInput style={styles.input} placeholder="Enter First Name" />
          <TextInput style={styles.input} placeholder="Enter Last Name" />
          <TextInput style={styles.input} placeholder="Enter Mobile Number" />

        <View style={styles.passwordContainer}>
            <TextInput
            style={styles.passwordInput}
            placeholder='Enter Password'
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


          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
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
        backgroundColor: '#fff',
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
        fontSize: 24,
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
      input: {
        borderColor: '#4285F4',
        borderWidth: 2,
        width: '100%',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        height: 40,
      },
      button: {
        backgroundColor: '#4285F4',
        width: '100%',
        marginTop: 20,
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
      },
      buttontext: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      text: {
        fontSize: 16,
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
        borderWidth: 2,
        width: '100%',
        marginTop: 20,
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

    });