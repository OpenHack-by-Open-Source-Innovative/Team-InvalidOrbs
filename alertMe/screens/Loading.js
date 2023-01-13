import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { StyleSheet, Text, View } from 'react-native';

export default function Loading({ navigation, route }) {

const [location, setLocation] = React.useState(null);
const [errorMsg, setErrorMsg] = React.useState(null);
let isNavigated = false

React.useEffect(() => {

 
        if (location == null){
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        if (isNavigated == false){
        let location = await Location.getCurrentPositionAsync({});
        if(location){
                navigation.replace("Map", {location: location});
                isNavigated = true;
        }
        setLocation(location);
    }
        console.log(location);
      })();
        }
    
  },[]);

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});