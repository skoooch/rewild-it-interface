import React, { useEffect, useRef, useState } from "react";
import MapView from "react-native-maps";
import { fetchDataGET } from "./utils/helpers";
import { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import Carousel, { Pagination } from "react-native-x-carousel";
import {
  StyleSheet,
  Pressable,
  View,
  Image,
  Region,
  Button,
  Text,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
const DATA = [{ text: "#1" }, { text: "#2" }, { text: "#3" }];
export default function Map({ navigation }) {
  const [pins, setPins] = useState([]);
  const [currentProj, setCurrentProj] = useState(null);
  const getPinDrops = async () => {
    const pins_res = await fetchDataGET("pindrop/");
    console.log(pins_res);
    setPins(pins_res.data);
  };
  useEffect(() => {
    getPinDrops();
  }, []);
  const [currLocation, setCurrLocation] = useState(TORONTO_REGION);
  const mapRef = useRef();

  const onRegionChange = (region: Region) => {
    setCurrLocation(region);
  };
  const onMarkerPress = async (marker) => {
    const pins_res = await fetchDataGET(`project/${marker.pindrop_id}`);
    setCurrentProj(pins_res);
    console.log(pins_res);
  };
  const addMarkerPress = () => {
    navigation.navigate("Add Project", {
      initialRegion: currLocation,
    });
  };
  const viewProject = () => {
    navigation.navigate("View Project", {});
  };
  const renderItem = (data) => (
    <View key={data.text} style={styles.item}>
      <Text>{data.text}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={TORONTO_REGION}
        onRegionChangeComplete={onRegionChange}
        ref={mapRef}
      >
        {pins.map((marker) => (
          <Marker
            key={marker.pindrop_id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={() => onMarkerPress(marker)}
          >
            <Callout>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    paddingBottom: 10,
                  }}
                >
                  Example Project
                </Text>
                <View style={{ paddingBottom: 10, alignSelf: "flex-start" }}>
                  <Image
                    style={{
                      resizeMode: "contain",
                      borderRadius: 10,
                      paddingBottom: 10,
                    }}
                    source={require("../assets/test_image.jpg")}
                  />
                </View>
                <Pressable
                  style={{
                    borderRadius: 5,
                    padding: 5,
                    backgroundColor: "#94D6B3",
                    paddingHorizontal: 10,
                  }}
                  onPress={viewProject}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    View Project
                  </Text>
                </Pressable>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          top: "87%", //for center align
          alignSelf: "flex-end",
          paddingRight: 22,
        }}
      >
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
    borderColor: "white",
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
    backgroundColor: "#BC96E6",
  },
  text: {
    fontSize: 60,
    lineHeight: 60,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
