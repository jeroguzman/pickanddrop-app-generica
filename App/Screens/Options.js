import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from "react-native";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import Icons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";


const Options = ({ navigation }) => {

  const isFocused = useIsFocused();

  const { logout, name, token, url, ids, status, setStatus } = useContext(AuthContext);

  const changeStatus = async () => {
    await axios.put(`${url}/couriers/change-courier-status/${ids}`, {
      status: status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED'
    }, {
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

  useEffect(() => {
    getCourierStatus();
  }
  , [isFocused]);

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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 24, paddingVertical: 12 }}>
            <View style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 38, fontWeight: "bold", color: "#000" }}>
                {name}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>
                {status === 'CONNECTED' ? 'Conectado' : 'Desconectado'} <Icons name={status === 'CONNECTED' ? 'circle' : 'circle'} size={20} color={status === 'CONNECTED' ? 'green' : 'gray'} />
              </Text>
            </View>
          </View>
        <ScrollView style={{ flex: 1, padding: 24 }}>
          <View style={{ flexDirection: "column", justifyContent: "space-between" }}> 
            <SafeAreaView style={{ flex: 1, marginTop: 5 }}>
              <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 26, fontWeight: "bold", color: "#000", marginTop: 20 }}>
                  Opciones
                </Text>
                <SafeAreaView style={ Platform.OS === 'ios' ? { flex: 1, marginTop: 10 } : { flex: 1, marginTop: 10, alignItems: "center" }}>
                  <TouchableOpacity
                    style={{
                        flexDirection: "row", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        backgroundColor: "#fff", 
                        borderRadius: 8, 
                        padding: 20, 
                        marginBottom: 20,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        width: "98%",
                        }}
                    onPress={() => navigation.navigate('Entregas')}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#2E2E2E" }}>
                      Entregas del día
                    </Text>
                    <Icons name="motorcycle" size={22} color={"#2E2E2E"} style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                        flexDirection: "row", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        backgroundColor: "#fff", 
                        borderRadius: 8, 
                        padding: 20, 
                        marginBottom: 20,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        width: "98%",
                        }}
                    onPress={() => navigation.navigate('PendingPayment')}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#2E2E2E" }}>
                      Pagos Pendientes
                    </Text>
                    <Icons name="money" size={20} color={"#2E2E2E"} style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{
                      width: "98%",
                      backgroundColor: 'red',
                      padding: 20,
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      shadowColor: "#000",
                      shadowOffset: {
                          width: 0,
                          height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5
                    }}
                    onPress={() => logout()}
                  >
                    <Text 
                      style={{
                        fontSize: 16, 
                        fontWeight: "bold", 
                        color: "#fff"
                      }}
                    >
                      Cerrar Sesión
                    </Text>
                    <Icons name="power-settings-new" size={26} color={"#fff"} style={{ marginLeft: 10, fontWeight: "bold" }} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{
                      width: "98%",
                      backgroundColor: status === 'CONNECTED' ? 'red' : 'green',
                      padding: 20,
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      shadowColor: "#000",
                      shadowOffset: {
                          width: 0,
                          height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5
                    }}
                    onPress={() => changeStatus()}
                  >
                    <Text 
                      style={{
                        fontSize: 16, 
                        fontWeight: "bold", 
                        color: "#fff"
                      }}
                    >
                      {status === 'CONNECTED' ? 'Desconectarse' : 'Conectarse'}
                    </Text>
                    <Icons name="power-settings-new" size={26} color={"#fff"} style={{ marginLeft: 10, fontWeight: "bold" }} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 16, fontWeight: "regular", color: "#1E1E1E", marginTop: 20 }}>
                    Versión 1.1.4
                  </Text>
                </SafeAreaView>
              </View>
            </SafeAreaView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Options;
