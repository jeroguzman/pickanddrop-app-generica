import React, { useEffect, useMemo, useContext, useState } from 'react'
import { View, StatusBar, Platform, Alert, Vibration } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useOnForegroundFocus } from '../../hooks/useOnForegroundFocus';
import AppNav from './AppNav';
import AuthNav from './AuthNav';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import useStore from '../../hooks/useStore';
import { Audio } from 'expo-av';

const ONE_SECOND_IN_MS = 1000;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
];

const LOCATION_TASK_NAME = "background-location-task";

const registerSound = async () => {
  Audio.setAudioModeAsync({
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
  });
  console.log('Loading Sound');
 
  const { sound } = await Audio.Sound.createAsync( require('../../assets/alarm.mp3'));
  useStore.setState({ sound: sound });
}

registerSound();

const playSound = async () => {
  const { sound } = useStore.getState();
  if (typeof sound.stopAsync() !== 'undefined') {
    console.log('1');
    await sound.playAsync();
  } else {
    console.log('2');
    registerSound();
    await sound.playAsync();
  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    try {
      const { id1, token1, url1, sound } = useStore.getState();
      axios.post(`${url1}/couriers/${id1}/set-courier-location/`, {
        location_lat: data.locations[0].coords.latitude,
        location_lng: data.locations[0].coords.longitude,
      },
      {
        headers: {
          Authorization: `Bearer ${token1}`
        }
      })
      .then((response) => {
        axios.get(`${url1}/orders/courier-notifications/${id1}`, 
          {
            headers: {
              Authorization: `Bearer ${token1}`
            }
          })
          .then((response) => {
            console.log('Notificacion: ', response.data.content);
            console.log(typeof response.data.content !== 'undefined');
            if (typeof response.data.content !== 'undefined') {
                playSound();
                Vibration.vibrate(PATTERN, true);
                Alert.alert('Notificación', response.data.content, 
                [
                  {
                    text: 'Aceptar',
                    onPress: () => {
                      let url =`${url1}/orders/mark-notifications/${response.data.id}`
                      if (response.data.content.includes('cancel')) {
                        url = url + '?notification_type=cancel'
                      }
                      axios.put(url,{
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${token1}`
                        }
                      })
                      .then((resp) => {
                        console.log('Notificación marcada');
                        console.log(sound);
                        Vibration.cancel();
                        if (sound) {
                          sound.stopAsync();
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    }
                  }
                ]);
            } else {
              if (sound) {
                Vibration.cancel();
                sound.stopAsync();
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

      return data.locations[0]
        ? BackgroundFetch.BackgroundFetchResult.NewData
        : BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (err) {
      console.log(err);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  }
});

function getVars() {
  const { token1, id1, url1 } = useStore.getState();
  return { token1, id1, url1 };
}

const AppNavigation = () => {

    const { ids, token, url } = useContext(AuthContext);
    
    const theme = useMemo(() => ({
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: '#fff',
          text: '#2E2E2E',
          border: '#2E2E2E',
          primary: '#2E2E2E',
        }
    }), []);

    useOnForegroundFocus(() => {
      const {sound, id1, token1, url1, state} = useStore.getState();
      axios.get(`${url1}/orders/courier-notifications/${id1}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`
        }
      })
      .then((response) => {
        console.log('Notificacion: ', response.data.content);
        console.log(typeof response.data.content !== 'undefined');
        if (typeof response.data.content !== 'undefined') {
          Alert.alert('Notificación', response.data.content, 
          [
            {
              text: 'Aceptar',
              onPress: () => {
                let url =`${url1}/orders/mark-notifications/${response.data.id}`
                if (response.data.content.includes('cancel')) {
                  url = url + '?notification_type=cancel'
                }
                axios.put(url,{
                },
                {
                  headers: {
                    Authorization: `Bearer ${token1}`
                  }
                })
                .then((resp) => {
                  console.log('Notificación marcada');
                  if (sound) {
                    sound.stopAsync();
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
              }
            }
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }, true);
      



  return (
    <NavigationContainer theme={theme}>
      <View
          style={{
            backgroundColor: '#fff',
            height: StatusBar.currentHeight,
          }}>
          <StatusBar
            animated={true}
            backgroundColor="#fff"
            barStyle='dark-content'
            showHideTransition='fade'
            hidden={false}
          />
      </View>
        { ids === undefined || ids === null ? <AuthNav /> : <AppNav /> }
    </NavigationContainer>
  )
}
  


export default AppNavigation;