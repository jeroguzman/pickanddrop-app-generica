import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Login';

const Stack = createNativeStackNavigator();

export default function AuthNav() {
  return (
      <>
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                headerShown: false,
                }} 
            />
        </Stack.Navigator>
        </>
    );
}