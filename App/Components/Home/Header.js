import { View, Text, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import Colors from '../../Shared/Colors'
import { AuthContext } from '../../Context/AuthContext'
import { Icon } from 'react-native-elements'

export default function Header({navigation}) {
    
    const { status, name } = useContext(AuthContext);
  
    return (
    <View 
        style={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-evenly',
            alignItems:'center'
        }}
    >
        <Image source={require('./../../../assets/images/logo.png')}
            style={styles.logo}
        />
        <View style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Text style={{fontSize:24, fontWeight:'bold'}}>{name}</Text>
            <Text style={{fontSize:16, fontWeight:'bold'}}>{status === 'CONNECTED' ? 'Conectado':'Desconectado'} <Icon name='circle' type='font-awesome' color={status === 'CONNECTED' ? 'green':'gray'} size={14} /></Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    logo:{
        width:100,
        height:100
    },
    userImage:{
        width:50,
        height:50,
        borderRadius:100
    }
})