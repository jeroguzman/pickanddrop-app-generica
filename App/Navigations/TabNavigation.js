import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Deliveries from '../Screens/Deliveries';
import Options from '../Screens/Options';
import { Ionicons } from '@expo/vector-icons';
import Home from '../Screens/Home';
export default function TabNavigation() {
    const Tab=createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions={{
        headerShown:false
    }}>
      <Tab.Screen name="Inicio" component={Home} 
      options={{
        tabBarLabel: 'Inicio',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ),
      }} />
      
      <Tab.Screen name="Entregas" component={Deliveries}
       options={{
        tabBarLabel: 'Entregas',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="bicycle" color={color} size={size} />
        ),
      }}/>

      <Tab.Screen name="Opciones" component={Options}
       options={{
        tabBarLabel: 'Opciones',
        tabBarIcon: ({ color, size }) => (
          
          <Ionicons name="list" color={color} size={size} />
        ),
      }}/>
    </Tab.Navigator>
  )
}