import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View,} from 'react-native';
import { Searchbar } from 'react-native-paper';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';



export default function Map({ navigation, route }) {

  const [searchQuery, setSearchQuery] = React.useState('');
  const [location, setLocation] = React.useState({coords : {
    latitude : route.params.location.coords.latitude,
    longitude : route.params.location.coords.longitude
  }});
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [sound, setSound] = React.useState();

  const [coordinate, setCoordinate] = React.useState({
    latitude: 0,
    longitude: 0,
  });

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('../assets/alarm.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  const onChangeSearch = query => setSearchQuery(query);

  const getGeoCode = () => {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&appid=d8aede95ec0c205ed8a4f9514ccea6d3`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json()).then((responseJson) => {
       // console.log(responseJson);
        setCoordinate({...coordinate, latitude: parseFloat(responseJson[0].lat), longitude: parseFloat(responseJson[0].lon)});
        console.log(coordinate);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const playAlarm = () => {
    playSound();
  };

  const isWithInTargetArea = (lat1, lon1, lat2, lon2) => {
    let radius=0.009009009;
    let distance = Math.sqrt(Math.pow((lat1-lat2),2) + Math.pow((lon1-lon2),2));

    console.log(distance);

    if(distance <= radius){
      console.log("You are in the target area")
      return true
    }else{
      console.log("You are not in the target area")
      return false
    }
  }

  const markers = [
    {
      latitude: 45.65,
      longitude: -78.90,
      title: 'Foo Place',
      subtitle: '1234 Foo Drive'
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        if(location){
          let isWithinTargetArea = isWithInTargetArea(location.coords.latitude, location.coords.longitude, coordinate.latitude, coordinate.longitude);
          if(isWithinTargetArea){
            navigation.replace("Alarm", {targetSet: true, location : location});
            setSearchQuery('');
            setLocation({coords : {latitude : 0,
              longitude : 0}})
          }
        }
        setLocation(location);
        console.log(location);
      })();
    }, 5000);

    return () => clearInterval(interval);
    
  });

  return (
    <SafeAreaView style={styles.container}>
        <Searchbar
              style = {styles.Searchbar}
              placeholder="Search"
              onChangeText={onChangeSearch}
              onSubmitEditing={getGeoCode}
              value={searchQuery}
        />
      
    <MapView style={styles.map} initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0,
              longitudeDelta: 0.0,
          }}  >
      <Marker coordinate={coordinate} pinColor='gold'></Marker>
    </MapView>
    
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'top',
    //width: '100%',
  },
  map: {
    marginTop: '5%',
    width: '100%',
    height: '90%',
  },
  Searchbar : {
    //alignSelf: 'center',
    width: '240%',
    marginLeft: '10%',
  },
});
