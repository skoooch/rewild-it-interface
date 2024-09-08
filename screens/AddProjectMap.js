import { useEffect, useRef, useState } from "react";
import Geocoder from "react-native-geocoding";
import MapView from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { fetchDataPOST, fetchDataGET, fetchDataIMAGE } from "./utils/helpers";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImageManipulator from "expo-image-manipulator";
import * as SecureStore from "expo-secure-store";

import {
  StyleSheet,
  Pressable,
  View,
  Region,
  TextInput,
  Button,
  Modal,
  Alert,
  Image,
  Platform,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Geocoder.init("AIzaSyA8YIQuUALtt8RvyCRFQUqcDV-Q9HxWbcU", { language: "en" }); // set the language
const BUTTON_SIZE = 35;
const BORDER_WIDTH = 1;

export default function AddProjectMap({ route, navigation }) {
  const [pins, setPins] = useState([]);
  const [currLocation, setCurrLocation] = useState(route.params.initialRegion);
  const [currAddress, setCurrAddress] = useState();
  const [dragging, setDragging] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const mapRef = useRef();

  const getPinDrops = async () => {
    const pins_res = await fetchDataGET(
      `pindrop/${"?delta=5&longitude="}${
        currLocation.longitude
      }${"&latitude="}${currLocation.latitude}`,
      {}
    );
    if (pins_res.data) {
      setPins(pins_res.data);
    } else {
      setPins([]);
    }
  };
  useEffect(() => {
    getPinDrops();
  }, []);

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const pickImage = async () => {
    if (status?.granted === false) {
      requestPermission();
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    if (!result.canceled) {
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio
        { compress: 0.7, format: "png" }
      );
      setImage(resizedPhoto);
    }
  };
  const [statusCam, requestPermissionCam] = ImagePicker.useCameraPermissions();
  const takeImage = async () => {
    if (statusCam?.granted === false) {
      requestPermissionCam();
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    if (!result.canceled) {
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio
        { compress: 0.7, format: "png" }
      );
      setImage(resizedPhoto);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!title) errors.title = "Title is required";
    if (!description) errors.description = "Description is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const onRegionChangeComplete = (region: Region) => {
    setDragging(false);
    setCurrLocation(region);
  };
  const onPanDrag = () => {
    setDragging(true);
  };
  const onMarkerPress = (marker: Marker) => {
    return;
  };
  const addProjectPress = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      console.log("Submitted", title, description);
      let currUser = await SecureStore.getItemAsync("currUser");
      try {
        const response = await fetchDataPOST("project/", {
          name: title,
          description: description,
          pindrop_latitude: currLocation.latitude,
          pindrop_longitude: currLocation.longitude,
          followers: [currUser],
        });
        if (image) {
          const image_response = await fetchDataIMAGE("image/", {
            uri: image.uri,
            name: "test",
            type: "image/png",
          });
          const add_image_response = await fetchDataPOST(
            `timeline/post/${response.timeline.posts[0].timeline_post_id}/image/${image_response.image_id}`
          );
        }

        navigation.navigate("View Project", {
          project_id: response.project_id,
          currUser: currUser,
        });
        setModalVisible(false);
      } catch (err) {
        Alert.alert("Error creating project.", err.message);
      }
    }
  };

  useEffect(() => {
    Geocoder.from(currLocation.latitude, currLocation.longitude)
      .then((json) => {
        var addressComponents = json.results[0].address_components;
        setCurrAddress(
          [addressComponents[0].long_name, addressComponents[1].long_name].join(
            " "
          )
        );
      })
      .catch((error) => console.warn(error));
  }, [currLocation]);

  return (
    <View style={styles.container}>
      <Modal
        style={{ paddingTop: 10, backgroundColor: "lightblue" }}
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAwareScrollView
          style={{
            flex: 1,
            backgroundColor: "lightblue",
            padding: 15,
            paddingBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={[styles.closeButton, { backgroundColor: "white" }]}
          >
            <Icon name={"close"} size={BUTTON_SIZE / 2} />
          </TouchableOpacity>
          <View style={{ ...styles.formContainer, marginVertical: 10 }}>
            <MapView
              style={styles.formMap}
              initialRegion={{
                latitude: currLocation.latitude,
                longitude: currLocation.longitude,
                latitudeDelta: 0.007,
                longitudeDelta: 0.007,
              }}
            >
              <Marker
                key={0}
                coordinate={{
                  latitude: currLocation.latitude,
                  longitude: currLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              />
            </MapView>
          </View>
          <View style={{ ...stylesForm.form, marginBottom: 50 }}>
            <Text style={stylesForm.label}>Project Title</Text>
            <TextInput
              style={stylesForm.input}
              placeholder="Enter your title"
              value={title}
              onChangeText={setTitle}
            />
            {errors.title ? (
              <Text style={stylesForm.errorText}>{errors.title}</Text>
            ) : null}
            <Text style={stylesForm.label}>Upload Image</Text>

            {image ? (
              <>
                <Button title="Change Image" onPress={pickImage} />
                <Button title="Capture an Image" onPress={takeImage} />
              </>
            ) : (
              <>
                <Button
                  title="Pick an image from camera roll"
                  onPress={pickImage}
                />
                <Button title="Capture an Image" onPress={takeImage} />
              </>
            )}
            {image && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Image
                  source={{ uri: image.uri }}
                  style={{ ...styles.image, borderRadius: 5 }}
                />
              </View>
            )}
            <Text style={stylesForm.label}>Project Description</Text>
            <TextInput
              multiline={true}
              numberOfLines={10}
              style={stylesForm.descriptionInput}
              placeholder="Enter your description"
              value={description}
              onChangeText={setDescription}
            />
            {errors.description ? (
              <Text style={stylesForm.errorText}>{errors.description}</Text>
            ) : null}

            <Button title="Create" onPress={handleSubmit} />
          </View>
        </KeyboardAwareScrollView>
      </Modal>
      <MapView
        style={styles.map}
        initialRegion={currLocation}
        onRegionChangeComplete={onRegionChangeComplete}
        onRegionChange={onPanDrag}
        ref={mapRef}
      >
        {pins.map((marker, index) => (
          <Marker
            key={marker.pindrop_id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          />
        ))}
      </MapView>
      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          top: "82%", //for center align
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          style={{
            ...styles.button,
          }}
          onPress={() => addProjectPress()}
        >
          <Text style={styles.text}>Start Project</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          top: "50%", //for center align
          alignSelf: "center",
        }}
      >
        <Pressable
          style={
            dragging ? styles.transparentButtonMarker : styles.buttonMarker
          }
          disabled
        >
          <Text style={styles.textMarker}></Text>
        </Pressable>
      </View>
      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          top: "91.5%", //for center align
          alignSelf: "center",
        }}
      >
        <Pressable style={styles.addressButton} disabled>
          <Text style={styles.addressText}>
            {dragging ? "Finding address..." : currAddress}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    height: 275,
  },
  map: {
    flex: 1,
  },
  formMap: {
    borderRadius: 20,
    paddingBottom: 20,
    flex: 1,
  },
  button: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#F2D8F9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.81,
    shadowRadius: 9.11,

    elevation: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F2D8F9",
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: BUTTON_SIZE + BORDER_WIDTH,
    height: BUTTON_SIZE + BORDER_WIDTH,
    borderWidth: BORDER_WIDTH,
    borderRadius: BUTTON_SIZE / 2,
  },
  text: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: 900,
    letterSpacing: 0.25,
    color: "#541d4d",
  },
  addressButton: {
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#541d4d",

    elevation: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F2D8F9",
  },
  addressText: {
    fontSize: 24,
    lineHeight: 24,

    letterSpacing: 0.25,
    color: "#541d4d",
  },
  buttonMarker: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    paddingVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: "darkblue",
  },
  transparentButtonMarker: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    opacity: 0.5,
    paddingVertical: 2,
    paddingHorizontal: 9,
    backgroundColor: "darkblue",
  },
  textMarker: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  image: {
    width: 300,
    height: 300,
  },
});
const stylesForm = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 0,
    backgroundColor: "lightblue",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  descriptionInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    height: 150,
    textAlignVertical: true,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
