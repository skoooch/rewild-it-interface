import React, { useEffect, useRef, useState } from 'react';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  Pressable,
  View,
  Region,
  Button,
  Text,
} from 'react-native';
Geocoder.init('AIzaSyA8YIQuUALtt8RvyCRFQUqcDV-Q9HxWbcU', { language: 'en' }); // set the language
const constMarkers = [
  {
    latitude: 43.65005,
    longitude: -79.401,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  {
    latitude: 43.66273179226731,
    longitude: -79.39456347458716,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
];
export default function AddProjectMap({ route, navigation }) {
  const [currLocation, setCurrLocation] = useState(route.params.initialRegion);
  const [currAddress, setCurrAddress] = useState();
  const [markers, setMarkers] = useState(constMarkers);
  const [dragging, setDragging] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    Geocoder.from(currLocation.latitude, currLocation.longitude)
      .then((json) => {
        var addressComponents = json.results[0].address_components;
        console.log([addressComponents[0].long_name, addressComponents[1].long_name].join(' '));
        setCurrAddress([addressComponents[0].long_name, addressComponents[1].long_name].join(' '));
      })
      .catch((error) => console.warn(error));
  }, [currLocation]);

  const onRegionChangeComplete = (region: Region) => {
    setDragging(false);
    setCurrLocation(region);
  };
  const onPanDrag = () => {
    setDragging(true);
  };
  const onMarkerPress = (marker: Marker) => {
    console.log(marker);
  };
  const addProjectPress = () => {
    console.log(currLocation);
    setMarkers((markers) => [...markers, currLocation]);
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currLocation}
        onRegionChangeComplete={onRegionChangeComplete}
        onRegionChange={onPanDrag}
        ref={mapRef}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            onPress={() => onMarkerPress(marker)}
          />
        ))}
      </MapView>
      <View
        style={{
          position: 'absolute', //use absolute position to show button on top of the map
          top: '50%', //for center align
          alignSelf: 'center',
        }}>
        <Pressable
          style={
            dragging ? styles.transparentButtonMarker : styles.buttonMarker
          }
          disabled>
          <Text style={styles.textMarker}></Text>
        </Pressable>
      </View>
      <View
        style={{
          position: 'absolute', //use absolute position to show button on top of the map
          top: '82%', //for center align
          alignSelf: 'center',
        }}>
        <Pressable style={styles.button} onPress={addProjectPress}>
          <Text style={styles.text}>Start Project at...</Text>
        </Pressable>
      </View>
      <View
        style={{
          position: 'absolute', //use absolute position to show button on top of the map
          top: '91.5%', //for center align
          alignSelf: 'center',
        }}>
        <Pressable style={styles.addressButton} disabled>
          <Text style={styles.addressText}>{dragging ? ("Finding address..."): currAddress}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.81,
    shadowRadius: 9.11,

    elevation: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'green',
  },
  text: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  addressButton: {
    borderRadius: 5,
    borderWidth: 3,
    borderColor: 'black',

    elevation: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'green',
  },
  addressText: {
    fontSize: 24,
    lineHeight: 24,
    
    letterSpacing: 0.25,
    color: 'white',
  },
  buttonMarker: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: 'darkblue',
  },
  transparentButtonMarker: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.5,
    paddingVertical: 2,
    paddingHorizontal: 9,
    backgroundColor: 'darkblue',
  },
  textMarker: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
