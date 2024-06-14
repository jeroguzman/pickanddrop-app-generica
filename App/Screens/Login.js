import { View, Text, TouchableOpacity, Image, ActivityIndicator, TextInput, StyleSheet, SafeAreaView } from 'react-native'
import React, { useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../Context/AuthContext';
import { usePopup } from 'react-native-popup-view';


export default function LoginScreen() {

  const { login, isLoading } = useContext(AuthContext);
  const navigation = useNavigation();
  const { showModal } = usePopup();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  if (isLoading === true) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#014aad" />
      </View>
    )
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (username !== '') {
      if (password !== '') {
        login(username, password);
      } else {
        showModal({
          customView: <View style={styles.floating}>
            <Image source={require('../../assets/peligro.png')} style={styles.logo} />
            <Text style={styles.text}>Ingrese su contraseña</Text>
            </View>,
          iconColor: 'red',
        });
      }
    } else {
      showModal({
        customView: <View style={styles.floating}>
          <Image source={require('../../assets/peligro.png')} style={styles.logo} />
          <Text style={styles.text}>Ingrese su usuario</Text>
          </View>,
        iconColor: 'red',
      });
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#F3F4F6'}}>
      <SafeAreaView  style={{backgroundColor: '#F3F4F6'}} edges={['top']}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
            <TouchableOpacity 
                onPress={()=> navigation.goBack()} 
                className="bg-[#ee2833] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
            {/* <ArrowLeftIcon size="20" color="white" /> */}
          </TouchableOpacity>
        </View>
        <View  style={{backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
            <Image 
                source={ require('../../assets/images/logo.png') }
                style={{ width: 280, height: 120, resizeMode: 'contain' }}
            />
        </View>
      </SafeAreaView>
      <View 
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50 ,backgroundColor: '#fff', flex: 1, padding: 20}}
        >
          <View className="form space-y-2">
            <Text style={{fontSize: 16, color: '#000', marginBottom: 10}}>Usuario</Text>
            <TextInput
              autoCapitalize='none'
              placeholder='Ingrese su usuario'
              autoCorrect={false}
              onChangeText={setUsername}
              value={username}
              style={{backgroundColor: '#F3F4F6', borderRadius: 10, paddingLeft: 20, paddingRight: 50, height: 50, fontSize: 16, color: '#000', marginBottom: 10}}
            />
            <Text style={{fontSize: 16, color: '#000', marginBottom: 10}}>Contraseña</Text>
            <View>
              <TextInput
                autoCapitalize='none'
                placeholder='Ingrese su contraseña' 
                autoCorrect={false} 
                secureTextEntry={!showPassword} 
                onChangeText={setPassword} 
                value={password} 
                style={{backgroundColor: '#F3F4F6', borderRadius: 10, paddingLeft: 20, paddingRight: 50, height: 50, fontSize: 16, color: '#000', marginBottom: 10}} 
              />
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color='black'
                onPress={toggleShowPassword}
                style={{position: 'absolute', top: 15, right: 10}}
              />
            </View>
            <TouchableOpacity 
              style={{backgroundColor: '#014aad', padding: 15, borderRadius: 10, marginTop: 20}}
              onPress={handleLogin}
            >
                <Text 
                    style={{color: '#fff', fontSize: 16, textAlign: 'center'}}
                >
                  Iniciar sesión
                </Text>
             </TouchableOpacity>
          </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    height: 44,
    borderWidth: 1,
    borderColor: 'blue',
    color: 'blue',
    borderRadius: 4,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'blue',
    fontWeight: '600',
  },
  floating: {
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    width: '100%',
  },
  text: {
    fontSize: 20,
    color: '#191919',
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: 'center',
  },
});
