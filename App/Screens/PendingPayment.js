import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import Icons from "@expo/vector-icons/MaterialIcons";
import { AuthContext } from '../Context/AuthContext';
import { useTheme } from "@react-navigation/native";
import axios from 'axios';

const PendingPayment = ({ navigation }) => {

  const { token, url, ids } = useContext(AuthContext);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [lastServices, setLastServices] = useState([]);

  
  useEffect(() => {
    const reloadData = navigation.addListener('focus', () => {
      setLoading(true);
      axios.get(`${url}/orders/pending-payment-orders-by-courier`, {
        params: {
          courier_id: ids,
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        setLoading(false);
        setLastServices(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });

    });

    return reloadData;

  }, []);


  return (
    <View style={{ gap: 12 }}>
      <View style={{ paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 36 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Icons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#000'}}>Pagos Pendientes</Text>
      </View>
      <ScrollView
        style={{ backgroundColor: colors.background, marginBottom: 160 }}
      >
        <FlatList
          data={lastServices}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={1}
          horizontal={false}
          vertical={false}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "600",
                  color: colors.text,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                No hay pagos pendientes
              </Text>
            </View>
          )}
          loading = {loading}
          LoadingView={() => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <ActivityIndicator size="large" color="#014aad" animating={loading ? true : false} />
            </View>
          )}
        />
    </ScrollView>
      <ActivityIndicator size="large" color="#014aad" animating={loading ? true : false} />
  </View>
      
  );
};

const Item = ({ item }) => (
  <TouchableOpacity
    style={{
      padding: 6,
      backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 20,
        margin: 10,
        flexDirection: 'row',
        gap: 12,
        borderRadius: 12,
    }}
  >
    <View style={{ flex: 1, flexDirection: 'column', gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#000',
          }}
          numberOfLines={2}
        >
          Orden #{item.id.toString().padStart(6, '0')}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#000',
          }}
          numberOfLines={2}
        >
          {item.created_at.split('T')[0] + ' ' + item.created_at.split('T')[1].split('.')[0].slice(0, -3)}
        </Text>
      </View>
      <Text style={{ fontSize: 18, color: '#000', paddingVertical: 4, fontWeight: 'bold' }}>{item.business.name}</Text>
      <Text
        style={{
          fontSize: 12,
          color: '#000',
          paddingVertical: 4,
        }}
        numberOfLines={3}
      >
       <Text style={{fontWeight: 600}}>Dirección de Pick:</Text> {item.business.address.replace('Hermosillo, Son., México', '')}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: '#000',
          paddingVertical: 4,
        }}
        numberOfLines={3}
      >
        <Text style={{fontWeight: 600}}>Dirección de Drop:</Text> {item.address.street + ' ' + item.address.external_number} {item.address.is_corner ? 'esquina con ' + item.address.corner_street : 'entre ' + item.address.between_street_1 + ' y ' + item.address.between_street_2} Col. {item.address.neighborhood.name}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: '#000',
          paddingVertical: 4,
        }}
      >
        <Text style={{fontWeight: 600}}>Referencia:</Text> {item.address.reference}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: '#000',
          paddingVertical: 4,
        }}
      >
        <Text style={{fontWeight: 600}}>Usuario:</Text> {item.client.first_name} {item.client.last_name}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: '#000',
          paddingVertical: 4,
        }}
      >
        <Text style={{fontWeight: 600}}>Telefono:</Text> {item.client.phone_number}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: '#000',
          paddingVertical: 4,
        }}
      >
        <Text style={{fontWeight: 600}}>Observaciones:</Text> {item.observations}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: '#000',
          paddingVertical: 4,
        }}
      >
        <Text style={{fontWeight: 600}}>Monto:</Text> {item.amount}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, backgroundColor: '#fff'
  },
  container: {
    flex: 1, flexDirection: 'column', justifyItems: 'center', alignItems: 'center',
    backgroundColor: '#fff', padding: 30
  },
  text: {
    paddingTop: 20
  },
  textLink: {
    paddingTop: 20,
    color: 'blue'
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default PendingPayment;