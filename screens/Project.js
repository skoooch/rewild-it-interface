import * as React from 'react';
import { useState, useEffect } from 'react';
import FIREBASE_APP from '../App.js'
const GLOBAL = require('../Global');
import { fetchDataGET, fetchDataPOST } from './utils/helpers';
import * as ImagePicker from 'expo-image-picker';
import HeaderComponent from '../navigation/ScrollHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView from 'react-native-maps';
const URI = GLOBAL.BACKEND_URI;
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  Text,
  View,
  Button,
  Image,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
const marker = {
  latitude: 43.65005,
  longitude: -79.401,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};
const BUTTON_SIZE = 35;
const BORDER_WIDTH = 1;
export default function Project({ route, navigation }) {
  const [following, setFollowing] = useState(false);
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [project, setProject] = useState({});
  const currUser = route.params.currUser
  const getProject = async () => {
    const project_res = await fetchDataGET(
      `project/${route.params.project_id}/`,
    );
    if (project_res.data) {
      setProject(project_res.data);
      const infoUnformatted = project_res.data.timeline.posts[0];
      const projectInfo = {
        id: infoUnformatted.timeline_post_id,
        prev_id: null,
        title: project_res.data.name,
        body: project_res.data.description,
        latitude: project_res.data.pindrop.latitude,
        longitude: project_res.data.pindrop.longitude,
        images: infoUnformatted.images,
        date: 'April 30th, 2027',
      };
      
      const user_object = await fetchDataGET(`user/${currUser}/`,);
      console.log(user_object)
      setFollowing(
        user_object.data.follows.includes(project_res.data.project_id)
      );
      setData([projectInfo, ...project_res.data.timeline.posts.slice(1)]);
    } else {
      setProject([]);
    }
  };
  useEffect(() => {
    getProject();
    setUpdateNeeded(false);
  }, [following, updateNeeded]);
  const [title, setTitle] = useState('');

  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const pickImage = async () => {
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
        { compress: 0.7, format: 'png' }
      );
      setImage(resizedPhoto);
    }
  };
  const validateForm = () => {
    let errors = {};
    if (!title) errors.title = 'Title is required';
    if (!description) errors.description = 'Description is required';
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };
  const addMarkerPress = () => {
    setModalVisible(true);
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      const response = await fetchDataPOST(
        `project/${route.params.project_id}/timeline`,
        { Title: title, Body: description }
      );
      console.log(response);
      console.log('Submitted', title, description);
      setTitle('');
      setDescription('');
      setErrors({});
      setModalVisible(false);
      setUpdateNeeded(true);
    }
  };
  const Item = ({
    title,
    description,
    prev_id,
    latitude,
    longitude,
    image,
  }) => (
    <View>
      {prev_id == null && (
        <View style={styles.itemFirst}>
          <View style={styles.itemHeaderFirst}>
            <Text style={styles.titleFirst}>{title}</Text>
            <Text
              style={{
                fontSize: 12,
                backgroundColor: '#ffffff',
                paddingTop: 0,
                color: '#606060',
              }}>
              Created April 18th, 2024 by JOhnnyWild
            </Text>
          </View>
          <View style={styles.formContainer}>
            <MapView
              style={styles.formMap}
              initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.007,
                longitudeDelta: 0.007,
              }}>
              <Marker
                key={0}
                coordinate={{ latitude: latitude, longitude: longitude }}
              />
            </MapView>
          </View>
          <Image
            source={`${URI}/images/files/150928c0-f0d5-469f-beb3-3415a534cf8c.png`}
            style={styles.image}
          />
          <View style={styles.itemDescriptionFirst}>
            <View
              style={{
                padding: 10,
                borderRadius: 5,
                backgroundColor: '#f0f0f0',
              }}>
              <Text style={styles.description}>{description}</Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 40,
              backgroundColor: '#ffffff',
              textAlign: 'center',
              paddingTop: 15,
              color: '#606060',
              fontStyle: 'italic',
              textDecorationLine: 'underline',
            }}>
            Project Timeline
          </Text>
        </View>
      )}
      {prev_id != null && (
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.title}>{title}</Text>
            <Text
              style={{
                fontSize: 12,
                backgroundColor: '#dddddd',
                paddingTop: 0,
                color: '#606060',
              }}>
              April 18th, 2024 by JOhnnyWild
            </Text>
          </View>
          <View style={{ flex: 1 }}></View>
          <View style={styles.itemDescription}>
            <View
              style={{
                padding: 10,
                borderRadius: 5,
                backgroundColor: '#f0f0f0',
              }}>
              <Text style={styles.description}>{description}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
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
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            style={stylesForm.container}>
            <View style={stylesForm.form}>
              <Text style={stylesForm.label}>Post Title</Text>
              <TextInput
                style={stylesForm.input}
                placeholder="Enter your title"
                value={title}
                onChangeText={setTitle}
              />
              <Text style={stylesForm.label}>Upload Images</Text>
              {errors.title ? (
                <Text style={stylesForm.errorText}>{errors.title}</Text>
              ) : null}
              <Button
                title="Pick an image from camera roll"
                onPress={pickImage}
              />
              {image && (
                <Image source={{ uri: image.uri }} style={styles.image} />
              )}
              <Text style={stylesForm.label}>Description</Text>
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
      <FlatList
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}
        data={data}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            prev_id={item.prev_id}
            description={item.body}
            latitude={item.latitude}
            longitude={item.longitude}
            image={item.images[0]}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <HeaderComponent
            following={following}
            setFollowing={setFollowing}
            num_followers={project.follower_count}
            discussion_board={project.discussion_board}
            project_id={project.project_id}
            user_id={currUser}
          />
        }
      />
      <View
        style={{
          position: 'absolute', //use absolute position to show button on top of the map
          top: '91%', //for center align
          alignSelf: 'flex-end',
          paddingRight: 22,
        }}>
        <Pressable style={styles.buttonAdd} onPress={addMarkerPress}>
          <Icon
            reverse={true}
            name="pencil-plus-outline"
            size={30}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 0,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#000000',
  },
  itemHeader: {
    flex: 1,
    backgroundColor: '#dddddd',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  itemFirst: {
    backgroundColor: '#ffffff',
    padding: 0,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: '#000000',
  },
  buttonAdd: {
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
    backgroundColor: '#BC96E6',
  },
  itemHeaderFirst: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    paddingBottom: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#909090',
  },
  title: {
    fontSize: 32,
    backgroundColor: '#dddddd',
  },
  titleFirst: {
    fontSize: 32,
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
  },
  description: {
    fontSize: 16,
  },
  itemDescription: {
    padding: 10,
  },
  itemDescriptionFirst: {
    padding: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#909090',
  },
  formContainer: {
    height: 275,
    paddingTop: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  formMap: {
    paddingTop: 20,
    borderRadius: 20,
    paddingBottom: 20,
    flex: 1,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: BUTTON_SIZE + BORDER_WIDTH,
    height: BUTTON_SIZE + BORDER_WIDTH,
    borderWidth: BORDER_WIDTH,
    borderRadius: BUTTON_SIZE / 2,
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
