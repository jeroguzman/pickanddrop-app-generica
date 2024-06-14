import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import AppNavigation from './App/Navigations/AppNavigation';
import { useFonts } from 'expo-font';
import Colors from './App/Shared/Colors';
import { AuthProvider } from './App/Context/AuthContext';
import { PopupProvider } from 'react-native-popup-view';

const windowW = Dimensions.get('window').width
const windowH = Dimensions.get('window').height

export default function App() {
  const [fontsLoaded] = useFonts({
    'raleway': require('./assets/Fonts/Raleway-Regular.ttf')
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <PopupProvider>
        <AuthProvider>
          <AppNavigation />
        </AuthProvider>
      </PopupProvider>
    </View> 
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingTop:20,
    width: windowW,
    height: windowH
  },
});
