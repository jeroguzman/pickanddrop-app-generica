import { View, Text, Linking, ActivityIndicator, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Card, Button } from 'react-native-elements'
import { ListItem } from '@rneui/themed';
import { io } from 'socket.io-client';
import Header from '../Components/Home/Header'
import { ScrollView } from 'react-native'
import { AuthContext } from '../Context/AuthContext'
import useStore from '../../hooks/useStore';
import { useIsFocused } from "@react-navigation/native";
import axios from 'axios'
import { useOnForegroundFocus } from '../../hooks/useOnForegroundFocus';

export default function Home({navigation}) {

  const isFocused = useIsFocused();

  const { token, ids, url, name, orders, setOrders } = useContext(AuthContext);
  const { notificacion, state } = useStore.getState();

  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
      getOrders();
  }, [isFocused]);

  useOnForegroundFocus(() => {
    getOrders();
  }
  , true);

  const getOrders = () => {
    setLoading(true);
    axios.get(`${url}/couriers/courier-current-orders/`, {
      params: {
        courier_id: ids,
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      setLoading(false);
      setOrders(response.data.data);
      setExpanded(new Array(response.data.data.length).fill(false));
    })
    .catch((error) => {
      setLoading(false);
      console.log(error);
    });
  }

  useEffect(() => {
    const socket = io('wss://pickdrop.mx');
    socket.on('connect', () => {
      console.log('Conectado');
    });
    
    socket.on(`${ids}_update_orders`, (data) => {
      console.log('update orders');
      getOrders();
    });
  
    return () => {
      if (socket) {
          socket.disconnect();
      }
  };
  }, []);

  
  return (
    console.log(notificacion),
    <ScrollView style={{padding:8, backgroundColor:'#fff', flex:1}}>
        <Header navigation={navigation} />
        <Text style={{fontSize:20, paddingHorizontal:15, marginTop: 20}}>{orders.length > 0 ? 'Pedidos en curso' : 'No hay pedidos en curso'}</Text>
        <FlatList
          data={orders}
          renderItem={({item, index}) => {
            return (
            <View>
              <ListItem.Accordion
                content={
                    <ListItem.Content style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                      <Card containerStyle={{borderRadius:10, padding:24, width:'100%', position:'relative', justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                        <View style={{flexDirection:'column', justifyContent:'center'}}>
                          <Text style={{fontSize:20,fontWeight:'bold',marginBottom:10}}>Pedido #{item.id.toString().padStart(6, '0')}</Text>
                        </View>
                        <Button
                          title={item.status_admin === 'ASSIGNED' ? 'Aceptar Pedido' : item.status_admin === 'ACCEPTED' ? 'En restaurante' : item.status_admin === 'ON_RESTAURANT' ? 'Saliendo del Restaurante' : item.status_admin === 'OUT_RESTAURANT' ? 'En la direccion del cliente' : item.status_admin === 'ON_DELIVERY' ? 'Entregado' : 'Error'}
                          containerStyle={{borderRadius:20, backgroundColor:'#FFF', width:130}}
                          buttonStyle={item.status_admin === 'ASSIGNED' ? {backgroundColor:'#FFD700'} : item.status_admin === 'ACCEPTED' ? {backgroundColor:'#00FF00'} : item.status_admin === 'ON_RESTAURANT' ? {backgroundColor:'#FFA500'} : item.status_admin === 'OUT_RESTAURANT' ? {backgroundColor:'#FF4500'} : item.status_admin === 'ON_DELIVERY' ? {backgroundColor:'#FF0000'} : {backgroundColor:'#FFF'}}
                          titleStyle={{color: item.status_admin === 'ASSIGNED' ? '#000' : item.status_admin === 'ACCEPTED' ? '#000' : item.status_admin === 'ON_RESTAURANT' ? '#FFF' : item.status_admin === 'OUT_RESTAURANT' ? '#FFF' : item.status_admin === 'ON_DELIVERY' ? '#FFF' : '#000'}}
                          onPress={() => {
                              axios.put(`${url}/orders/order-status/${item.id}/`, {
                                status: item.status_admin === 'ASSIGNED' ? 'ACCEPTED' : item.status_admin === 'ACCEPTED' ? 'ON_RESTAURANT' : item.status_admin === 'ON_RESTAURANT' ? 'OUT_RESTAURANT' : item.status_admin === 'OUT_RESTAURANT' ? 'ON_DELIVERY' : item.status_admin === 'ON_DELIVERY' ? 'DELIVERED' : '',
                              }, {
                                headers: {
                                  'Authorization': `Bearer ${token}`
                                }
                              })
                              .then((response) => {
                                console.log(response.data);
                                getOrders();
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                            
                          }}
                        />
                      </Card>
                    </ListItem.Content>
                }
                isExpanded={expanded[index]}
                onPress={() => {
                  if (item.status_admin !== 'ASSIGNED') {
                    setExpanded(expanded.map((value, i) => i === index ? !value : false));
                  } else {
                    alert('Debes aceptar el pedido para ver los detalles');
                  }
                }}
              >
                  <ListItem >
                    <ListItem.Content>
                      <View style={{flexDirection:'column', width:'100%'}}>
                        <Text style={{fontSize:15,marginBottom:10,fontWeight: 600}}>Dirección del Pick ({item.business.name.toUpperCase()}): </Text>
                        <Text style={{fontSize:15,marginBottom:10}}>{item.business.address_courier} Col. {item.business.neighborhood}</Text>
                        <Text style={{fontSize:15,marginBottom:10,fontWeight: 600}}>Dirección del Drop: </Text>
                        <Text style={{fontSize:15,marginBottom:10}}>{item.address.street} {item.address.external_number} {item.address.is_corner && item.address.corner_street ? 'esquina con '+ item.address.corner_street : item.address.between_street_1 && item.address.between_street_2 ? 'entre ' + item.address.between_street_1 + ' y ' + item.address.between_street_2 : ''}, Col. {item.address.neighborhood.name}</Text>
                        <Text style={{fontSize:15,marginBottom:10}}><Text style={{fontWeight: 600}}>Referencia:</Text> {item.address.reference}</Text>
                        <Text style={{fontSize:15,marginBottom:10}}><Text style={{fontWeight: 600}}>Usuario:</Text> {item.client.first_name} {item.client.last_name}</Text>
                        <Text style={{fontSize:15,marginBottom:10}}><Text style={{fontWeight: 600}}>Telefono:</Text> {item.client.phone_number}</Text>
                        <Text style={{fontSize:15,marginBottom:10}}><Text style={{fontWeight: 600}}>Observaciones:</Text> {item.observations}</Text>
                        <Text style={{fontSize:15,marginBottom:10}}><Text style={{fontWeight: 600}}>Monto:</Text> {item.amount}</Text>
                        <Text style={{fontSize:15,marginBottom:10}}><Text style={{fontWeight: 600}}>Paga con:</Text> {item.payment_amount}</Text>
                        <Button
                          title="Ver Mapa"
                          type="outline"
                          containerStyle={{borderRadius:10}}
                          buttonStyle={{ backgroundColor: '#014aad' }}
                          titleStyle={{color:'#fff'}}
                          onPress={() => {
                            Linking.openURL(`https://www.google.com/maps/dir/${item.business.address.split(' ').join('+')}/${item.address.street.split(' ').join('+')}+${item.address.external_number}+${item.address.neighborhood.name.split(' ').join('+')}`);
                          }}
                        />
                        <Button
                          title="Llamar"
                          type="outline"
                          containerStyle={{borderRadius:10, marginTop:10}}
                          buttonStyle={{ backgroundColor: '#014aad' }}
                          titleStyle={{color:'#fff'}}
                          onPress={() => {
                            Linking.openURL(`tel:${item.client.phone_number}`);
                          }}
                        />
                      </View>
                    </ListItem.Content>
                  </ListItem>
              </ListItem.Accordion>
            </View>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
          extraData={state}
          listEmptyComponent={() => {
            return (
              <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center'}}>No hay pedidos en curso</Text>
              </View>
            )
          }}
        />
    </ScrollView>
  )
}