import React, { useEffect, useRef, useState } from "react";
import MapView from "react-native-maps";
import { fetchDataGET } from "./utils/helpers";
import { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from "@react-navigation/native";
const GLOBAL = require("../Global");
const URI = GLOBAL.BACKEND_URI;
import {
  StyleSheet,
  Pressable,
  View,
  Image,
  Region,
  Button,
  Text,
} from "react-native";
const INIT_ZOOM = 0.05;
const TORONTO_REGION = {
  latitude: 43.65,
  longitude: -79.39,
  latitudeDelta: INIT_ZOOM,
  longitudeDelta: INIT_ZOOM,
};
export default function Map({ route, navigation }) {
  const isFocused = useIsFocused();
  const [imageID, setImageID] = useState("");
  const [pins, setPins] = useState([]);
  const [currUser, setCurrUser] = useState("");
  const [currProj, setCurrentProj] = useState({});
  const [currLocation, setCurrLocation] = useState(TORONTO_REGION);
  const getPinDrops = async () => {
    let pins_res = null;
    try {
      pins_res = await fetchDataGET(
        `pindrop/${"?delta=5&longitude="}${
          currLocation.longitude
        }${"&latitude="}${currLocation.latitude}`
      );
    } catch (e) {
      console.log(e);
    }
    if (pins_res.data) {
      setPins(pins_res.data);
    } else {
      setPins([]);
    }
    let currUser = await SecureStore.getItemAsync("currUser");
    setCurrUser(currUser);
  };
  useEffect(() => {
    if (isFocused) getPinDrops();
  }, [isFocused]);

  const mapRef = useRef();

  const onRegionChange = (region: Region) => {
    setCurrLocation(region);
  };
  const onMarkerPress = async (marker) => {
    const pins_res = await fetchDataGET(`project/${marker.project_id}/`, {});
    if (pins_res.data.timeline.posts[0].images[0]) {
      setImageID(pins_res.data.timeline.posts[0].images[0].image_id);
    }
    setCurrentProj(pins_res.data);
  };
  const addMarkerPress = () => {
    navigation.navigate("Add Project", {
      initialRegion: currLocation,
      currUser: currUser,
    });
  };
  const viewProject = () => {
    navigation.navigate("View Project", {
      project_id: currProj.project_id,
      currUser: currUser,
    });
  };
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
                  paddingVertical: 10,
                  alignSelf: "stretch",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "900",
                    fontSize: 20,
                    marginBottom: 10,
                  }}
                >
                  {currProj.name}
                </Text>
                <View
                  style={{
                    paddingVertical: 0,
                    marginLeft: 15,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#fff",
                    height: 200,
                    width: 300,
                    borderRadius: 40,
                  }}
                >
                  {imageID && (
                    <Image
                      style={{
                        height: 200,
                        width: 300,
                        borderRadius: 40,
                      }}
                      source={{ uri: `${URI}images/files/${imageID}.png` }}
                    />
                  )}
                  {!imageID && (
                    <Image
                      style={{
                        height: 200,
                        width: 300,
                        borderRadius: 40,
                      }}
                      source={{ uri: `${URI}images/files/${imageID}.png` }}
                    />
                  )}
                </View>
                <Pressable
                  style={{
                    marginTop: 10,
                    paddingVertical: 10,
                    borderRadius: 5,
                    padding: 5,
                    backgroundColor: "#94D6B3",
                  }}
                  onPress={viewProject}
                >
                  <Text
                    style={{
                      fontWeight: "900",
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
