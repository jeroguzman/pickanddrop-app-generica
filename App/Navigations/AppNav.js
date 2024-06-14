import React, { useEffect, useContext, useState, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import TabNavigation from './TabNavigation';
import { AuthContext } from '../Context/AuthContext';
import { useOnForegroundFocus } from '../../hooks/useOnForegroundFocus';
import { usePushNotifications } from '../../hooks/useExpoNotifications';
import axios from 'axios';
import PendingPayment from '../Screens/PendingPayment';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = "background-location-task";

const FETCH_INTERVAL = 10000;

const requestPermissions = async () => {
  console.log("Requesting permissions for location updates...");
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === "granted") {
    console.log("Foreground permissions granted!");
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === "granted") {
      console.log("Background permissions granted!");
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: FETCH_INTERVAL,
      });
      console.log("Location updates started successfully!");
    }
  }
};

const Stack = createNativeStackNavigator();

export default function AppNav() {

  const { ids, token, url, setStatus } = useContext(AuthContext);

  const { expoPushToken, notification } = usePushNotifications();

  const [message, setMessage] = useState({});

  useEffect(() => {
        if (expoPushToken) {
          axios.post(`${url}/couriers/${ids}/register-notifications-token/`, {
            notifications_token: expoPushToken.data
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then((response) => {
            console.log('Token registrado');
          }
          ).catch((error) => {
            console.log(error);
          });
        } else {
          console.log('No se pudo registrar el token');
        }

  }, [expoPushToken]);

  useOnForegroundFocus(() => {
    getCourierStatus();
  }, true);

  const getCourierStatus = async () => {
    await axios.get(`${url}/couriers/courier-status/${ids}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      setStatus(response.data.status);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
      <>
        <Stack.Navigator initialRouteName='TabsStack'>
          <Stack.Screen
            name="TabsStack"
            component={TabNavigation}
            options={{
              headerShown: false,
            }}
          />
            <Stack.Screen
                name="PendingPayment"
                component={PendingPayment}
                options={{
                headerShown: false,
                }} />
        </Stack.Navigator>
        </>
    );
}

