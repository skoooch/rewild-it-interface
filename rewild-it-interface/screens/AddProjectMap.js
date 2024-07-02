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
  const [markers, setMarkers] = useState(constMarkers);
  const [dragging, setDragging] = useState(false);
  const mapRef = useRef();
  const onRegionChange = (region: Region) => {
    console.log(region);
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
        onRegionChangeComplete={onRegionChange}
        onPanDrag={onPanDrag}
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
          top: '87%', //for center align
          alignSelf: 'center',
        }}>
        <Pressable style={styles.button} onPress={addProjectPress}>
          <Text style={styles.text}>Start Project Here</Text>
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
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 'bold',
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
