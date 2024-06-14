import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePopup } from 'react-native-popup-view';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, Image } from 'react-native';
import useStore from "../../hooks/useStore";
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const { showModal } = usePopup();
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(undefined);
    const [name, setName] = useState(undefined);
    const [ids, setIds] = useState(undefined);
    const [status, setStatus] = useState(undefined);
    const [orders, setOrders] = useState([]);
    const [url, setUrl] = useState('https://pickdrop.mx:445/api');
    //const [url, setUrl] = useState('http://192.168.100.3:8000/api');

    

    useEffect(() => {
      const getToken = async () => {
          try {
              const token = await AsyncStorage.getItem('userToken');
              const id = await AsyncStorage.getItem('id');
              const name = await AsyncStorage.getItem('name');
              const status = await AsyncStorage.getItem('status');
              if (token !== null || token !== undefined) {
                  setToken(token);
                  setIds(id);
                  setName(name);
                  setStatus(status);
              }
          } catch(e) {
              console.log(e);
          }
      }
      getToken();
  }
  , []);


    useEffect(() => {
      useStore.setState({ token1: token, id1: ids, url1: url });
    }
    , [token, ids, url]);

    const login = async (username, password) => {
        setIsLoading(true);
        await axios.post(`${url}/users/courier-login/`, {
          username: username,
          password: password
        }).then(async (response) => {
          await AsyncStorage.setItem('userToken', response.data.access);
          await AsyncStorage.setItem('id', response.data.id.toString());
          await AsyncStorage.setItem('name', response.data.name);
          await AsyncStorage.setItem('status', response.data.status);
          setToken(response.data.access);
          setIds(response.data.id.toString());
          setName(response.data.name);
          setStatus(response.data.status);
          setIsLoading(false);
          console.log('inicio de sesión exitoso');
        }).catch((error) => {
            console.log(error);
            setIsLoading(false);
            showModal({
              customView: <View style={styles.floating}>
                <Image source={require('../../assets/error.png')} style={styles.logo} />
                <Text style={styles.text}>Usuario o contraseña incorrectos</Text>
                </View>,
              iconColor: 'red',
            });
        });
    }
        

    const logout = async () => {
        setIsLoading(true);
        try {
            changeStatusDisconnected();
            Location.stopLocationUpdatesAsync('background-location-task');
            setToken(undefined);
            setName(undefined);
            setStatus(undefined);
            setIds(undefined);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('id');
            await AsyncStorage.removeItem('name');
            await AsyncStorage.removeItem('status');
            console.log('sesión cerrada');
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
        }
    }

    const changeStatusDisconnected = async () => {
      await axios.put(`${url}/couriers/change-courier-status/${ids}`, {
        status: 'DISCONNECTED'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    }

    

    return (
      <AuthContext.Provider value={{ login, logout, token, isLoading, ids, url, name, status, setStatus, orders, setOrders }}>
        {children}
      </AuthContext.Provider>
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