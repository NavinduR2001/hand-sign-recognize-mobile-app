import React,{useState} from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground,TextInput, TouchableOpacity,Image, KeyboardAvoidingView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Login() {
    const navigation = useNavigation();

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

  return (
    <>
   
    <StatusBar barStyle="light-content" backgroundColor="#154DC6" />
    <ImageBackground
    source={require('../assets/BackGround.png')}
    style={styles.backgroundimg}
    resizeMode='cover'
    >
    
    <KeyboardAvoidingView
            style={{ flex: 1, width: '100%', paddingBlockStart: 0, }}
            behavior='padding'
     >
    <View style={styles.container}>

    <View style={styles.logotop}>
    <Image source={require('../assets/white-logo.png')} style={styles.logo} />
    <Text style={styles.welcome}>Welcome to the WaweWords!</Text>
    </View>

    <View style={styles.foam}>

      <Text style={styles.text}>Do you have an account, <Text style={styles.bold}>Sign in</Text> Now!</Text>
        <TextInput style={styles.input} placeholder='Mobile Number'/>
        <View style={styles.passwordContainer}>
        <TextInput
                  style={styles.passwordInput}
                  placeholder='Password'
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
        </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button}  onPress={()=>navigation.navigate("Home")}>
            <Text style={styles.buttontext}>LOGIN</Text>
        </TouchableOpacity>

      <Text style={styles.text}>Don’t have an account, Please <Text style={styles.bold}>Sign up</Text> Now!</Text>

      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Signup")}>
            <Text style={styles.buttontext}>SIGN UP</Text>
        </TouchableOpacity>
    </View>

    </View>
   
    </KeyboardAvoidingView>
    </ImageBackground>
    
    </>
  );
}

const styles = StyleSheet.create({

   foam:{flex:1,
    width:'100%',
    // backgroundColor:'black',
    alignItems:'center',
    justifyContent:'center',

   },

    backgroundimg:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    },

  container: {
    flex: 1,
    width:'100%',
    height:'100%',
    margin:0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft:30,
    paddingRight:30,
    // backgroundColor:'green'
     },

    text: {
    fontSize: 16,
    color:'white',
    
    },
    bold:{
        fontWeight:'bold',
    },
    input:{
        padding: 10,
        borderColor: '#4285F4',
        borderWidth: 2,
        width: '100%',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        
        
    },

    button:{
        
        backgroundColor:'#4285F4',
        width:'100%',
        marginBlockStart:20,
        marginBottom:20,
        textAlign:'center',
        padding:0,
        borderRadius:10,
        height:40,
        justifyContent:'center',
        alignItems:'center',
    },
    buttontext:{
        color:'white',
        fontSize:16,
        fontWeight:'bold'
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    logotop:{
        
        width:'100%',
        height:320,
        justifyContent:'center',
        alignItems:'center',
        paddingBlockEnd:60,
        
    },
    welcome:{
        color:'white',
        fontSize:20,
        fontFamily:'Inter-Light'
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
