import React, { useEffect, useRef, useState } from 'react';
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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Animated from 'react-native-reanimated';

const Stack = createNativeStackNavigator();

const INIT_ZOOM = 0.05;
console.log(markers);
const TORONTO_REGION = {
  latitude: 43.65,
  longitude: -79.39,
  latitudeDelta: INIT_ZOOM,
  longitudeDelta: INIT_ZOOM,
};
const markers = [
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
export default function Map({navigation }) {
  const [currLocation, setCurrLocation] = useState(TORONTO_REGION)
  const mapRef = useRef();
  const onRegionChange = (region: Region) => {
    console.log(region);
    setCurrLocation(region)
  };
  const onMarkerPress = (marker: Marker) => {
    console.log(marker);
  };
  const addMarkerPress = () => {
    console.log(currLocation)
    navigation.navigate("Add Project",{
            initialRegion: currLocation,
          })
  }
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={TORONTO_REGION}
        onRegionChangeComplete={onRegionChange}
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
          top: '87%', //for center align
          alignSelf: 'flex-end',
          paddingRight: 22,
        }}>
        <Pressable style={styles.button} onPress={addMarkerPress}>
          <Text style={styles.text}>+</Text>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.81,
    shadowRadius: 9.11,

    elevation: 14,
    paddingVertical: 0,
    paddingHorizontal: 10,
    backgroundColor: 'green',
  },
  text: {
    fontSize: 60,
    lineHeight: 60,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});