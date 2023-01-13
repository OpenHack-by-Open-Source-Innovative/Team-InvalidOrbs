import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';


export default function App() {

  const [searchQuery, setSearchQuery] = React.useState('');
  const [coordinate, setCoordinate] = React.useState({
    latitude: 0,
    longitude: 0,
  });

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
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  const markers = [
    {
      latitude: 45.65,
      longitude: -78.90,
      title: 'Foo Place',
      subtitle: '1234 Foo Drive'
    }
  ];

  React.useEffect(() => {
    
  }, [searchQuery]);

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
