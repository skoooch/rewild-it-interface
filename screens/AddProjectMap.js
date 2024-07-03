import React, { useEffect, useRef, useState } from 'react';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  Pressable,
  View,
  Region,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Modal,
  Image,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
const BUTTON_SIZE = 35;
const BORDER_WIDTH = 1;

export default function AddProjectMap({ route, navigation }) {
  const [response, setResponse] = useState(null);
  const [currLocation, setCurrLocation] = useState(route.params.initialRegion);
  const [currAddress, setCurrAddress] = useState();
  const [markers, setMarkers] = useState(constMarkers);
  const [dragging, setDragging] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const mapRef = useRef();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    if (!title) errors.title = 'Title is required';
    if (!description) errors.description = 'Description is required';

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Submitted', title, description);
      setTitle('');
      setDescription('');
      setErrors({});
    }
  };

  useEffect(() => {
    Geocoder.from(currLocation.latitude, currLocation.longitude)
      .then((json) => {
        var addressComponents = json.results[0].address_components;
        console.log(
          [addressComponents[0].long_name, addressComponents[1].long_name].join(
            ' '
          )
        );
        setCurrAddress(
          [addressComponents[0].long_name, addressComponents[1].long_name].join(
            ' '
          )
        );
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
  const imageUpload = () => {
    launchImageLibrary(setResponse)
  };
  const addProjectPress = () => {
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: 'lightblue', padding: 15 }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={[styles.closeButton, { backgroundColor: 'white' }]}>
            <Icon name={'close'} size={BUTTON_SIZE / 2} />
          </TouchableOpacity>
          <View style={styles.formContainer}>
            <MapView
              style={styles.formMap}
              initialRegion={{
                latitude: currLocation.latitude,
                longitude: currLocation.longitude,
                latitudeDelta: 0.007,
                longitudeDelta: 0.007,
              }}>
              <Marker
                key={0}
                coordinate={currLocation}
              />
            </MapView>
          </View>
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            style={stylesForm.container}>
            <View style={stylesForm.form}>
              <Text style={stylesForm.label}>Project Title</Text>
              <TextInput
                style={stylesForm.input}
                placeholder="Enter your title"
                value={title}
                onChangeText={setTitle}
              />
              <Text style={stylesForm.label}>Upload Images</Text>
              <Button title="Upload Image" onPress={imageUpload}/>
              {errors.title ? (
                <Text style={stylesForm.errorText}>{errors.title}</Text>
              ) : null}

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
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
          <Text style={styles.text}>Start Project</Text>
        </Pressable>
      </View>
      <View
        style={{
          position: 'absolute', //use absolute position to show button on top of the map
          top: '91.5%', //for center align
          alignSelf: 'center',
        }}>
        <Pressable style={styles.addressButton} disabled>
          <Text style={styles.addressText}>
            {dragging ? 'Finding address...' : currAddress}
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
    flex: 1,
  },
  map: {
    flex: 1,
  },
  formMap: {
    borderRadius: 20,
    flex: 1,
  },
  button: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F2D8F9',
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
    backgroundColor: '#F2D8F9',
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: BUTTON_SIZE + BORDER_WIDTH,
    height: BUTTON_SIZE + BORDER_WIDTH,
    borderWidth: BORDER_WIDTH,
    borderRadius: BUTTON_SIZE / 2,
  },
  text: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#541d4d',
  },
  addressButton: {
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#541d4d',

    elevation: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F2D8F9',
  },
  addressText: {
    fontSize: 24,
    lineHeight: 24,

    letterSpacing: 0.25,
    color: '#541d4d',
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
const stylesForm = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,
    backgroundColor: 'lightblue',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
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
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  descriptionInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    height: 150,
    textAlignVertical: true,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
