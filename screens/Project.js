import * as React from 'react';
import { useState, useEffect } from 'react';
const GLOBAL = require('../Global');
const URI = GLOBAL.BACKEND_URI;
import {
  fetchDataGET,
  fetchDataPOST,
  fetchDataIMAGE,
  fetchDataPATCH,
} from './utils/helpers';
import * as ImagePicker from 'expo-image-picker';
import HeaderComponent from '../components/ScrollHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import {
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
  Button,
  Linking,
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const BUTTON_SIZE = 35;
const BORDER_WIDTH = 1;
export default function Project({ route, navigation }) {
  const [following, setFollowing] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [project, setProject] = useState({});
  const currUser = route.params.currUser;
  const getDirections = () => {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${data[0].latitude},${data[0].longitude}`;
    const label = `${data[0].title}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };
  const getProject = async () => {
    const project_res = await fetchDataGET(
      `project/${route.params.project_id}/`
    );
    if (project_res.data) {
      setProject(project_res.data);
      const infoUnformatted = project_res.data.timeline.posts[0];
      const date = new Date(infoUnformatted.created_ts.split('T')[0]);
      let author = '';
      console.log(infoUnformatted);
      if (infoUnformatted.author_id) {
        console.log('here');
        const user_object = await fetchDataGET(
          `user/${infoUnformatted.author_id}/`
        );
        author = user_object.data.username;
      }
      console.log(author);
      const projectInfo = {
        id: infoUnformatted.timeline_post_id,
        prev_id: null,
        title: project_res.data.name,
        author: author,
        latitude: project_res.data.pindrop.latitude,
        longitude: project_res.data.pindrop.longitude,
        images: [],
        date: `${date.toLocaleString('default', {
          month: 'long',
        })} ${date.getDate()}, ${date.getFullYear()}`,
      };

      const first_timeline = {
        id: '0',
        prev_id: 'first',
        title: 'Project Proposal',
        body: project_res.data.description,
        images: infoUnformatted.images,
        author: author,
        date: `${date.toLocaleString('default', {
          month: 'long',
        })} ${date.getDate()}, ${date.getFullYear()}`,
      };
      setEditDescription(project_res.data.description);
      let timelines = [];
      for (const post of project_res.data.timeline.posts.slice(1)) {
        const date = new Date(post.created_ts);
        if (post.author_id) {
          const user_object = await fetchDataGET(`user/${post.author_id}/`);
          author = user_object.data.username;
        }
        console.log(date);
        console.log(
          `${date.toLocaleString('default', {
            month: 'long',
          })} ${date.getDate()}, ${date.getFullYear()}`
        );
        timelines.push({
          ...post,
          author: author,
          date: `${date.toLocaleString('default', {
            month: 'long',
          })} ${date.getDate()}, ${date.getFullYear()}`,
        });
      }
      const user_object = await fetchDataGET(`user/${currUser}/`);
      setFollowing(
        user_object.data.follows.includes(project_res.data.project_id)
      );
      setData([projectInfo, first_timeline, ...timelines]);
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
        { compress: 0.7, format: 'png' }
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
        { title: title, body: description, author_id: currUser }
      );
      if (image) {
        const image_response = await fetchDataIMAGE('image/', {
          uri: image.uri,
          name: 'test',
          type: 'image/png',
        });
        const add_image_response = await fetchDataPOST(
          `timeline/post/${
            response.posts[response.posts.length - 1].timeline_post_id
          }/image/${image_response.image_id}`
        );
      }
      console.log('Submitted', title, description);
      setTitle('');
      setDescription('');
      setErrors({});
      setModalVisible(false);
      setUpdateNeeded(true);
    }
  };
  const handleEditSubmit = async () => {
    const response = await fetchDataPATCH(
      `project/${route.params.project_id}/description`,
      { description: editDescription }
    );
    console.log('Submitted', description);
    setEditModalVisible(false);
    setUpdateNeeded(true);
  };
  const Item = ({
    title,
    description,
    prev_id,
    latitude,
    longitude,
    image_file,
    date,
    author,
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
              }}>
              {`Created ${date}`}
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
          <TouchableOpacity
            style={{
              marginTop: 10,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: '#F091F3',
              borderRadius: 10,
              borderWidth: 5,
              borderColor: '#F091F3',
            }}
            onPress={getDirections}
            underlayColor="#fff">
            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                fontSize: 15,
                paddingLeft: 10,
                paddingRight: 10,
                fontWeight: '900',
              }}>
              View in Maps
            </Text>
          </TouchableOpacity>

          <View style={styles.itemDescriptionFirst}></View>
          <Text
            style={{
              fontSize: 40,
              backgroundColor: '#ffffff',
              textAlign: 'center',
              paddingTop: 30,
              color: '#010101',
              fontWeight: '900',
            }}>
            Project Timeline
          </Text>
        </View>
      )}
      {prev_id != null && (
        <View style={styles.item}>
          {prev_id == 'first' ? (
            <View style={styles.itemHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{title}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    backgroundColor: '#94D6B3',
                    paddingTop: 0,
                    color: '#000000',
                  }}>
                  {prev_id == 'first'
                    ? `Posted ${date}`
                    : `Posted ${date} by ${author}`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setEditModalVisible(true);
                }}>
                <Icon name="pencil-outline" size={30} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                bottomBorderColor: '#000000',
                ...styles.itemHeaderLast,
                backgroundColor: '#c0c0c0',
              }}>
              <Text style={{ ...styles.title, backgroundColor: '#c0c0c0' }}>
                {title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  backgroundColor: '#c0c0c0',
                  paddingTop: 0,
                  color: '#000000',
                }}>
                {prev_id == 'first'
                  ? `Posted ${date}`
                  : `Posted ${date} by ${author}`}
              </Text>
            </View>
          )}

          <View style={{ flex: 1 }}></View>
          {image_file && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Image
                source={{
                  uri: `${URI}images/files/${image_file.image_id}.png`,
                }}
                style={styles.image}
              />
            </View>
          )}
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
        <KeyboardAwareScrollView
          style={{
            flex: 1,
            backgroundColor: 'lightblue',
            padding: 15,
            paddingBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={[styles.closeButton, { backgroundColor: 'white' }]}>
            <Icon name={'close'} size={BUTTON_SIZE / 2} />
          </TouchableOpacity>
          <Text
            style={{
              ...styles.title,
              backgroundColor: 'lightblue',
              marginTop: 10,
              textAlign: 'center',
            }}>
            Create Timeline Post
          </Text>
          <View style={{ ...stylesForm.form, marginTop: 20 }}>
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <Image
                  source={{ uri: image.uri }}
                  style={{ ...styles.image, borderRadius: 5 }}
                />
              </View>
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
        </KeyboardAwareScrollView>
      </Modal>
      <Modal
        animationType="slide"
        visible={editModalVisible}
        presentationStyle="pageSheet"
        style={{ marginTop: 400 }}>
        <KeyboardAwareScrollView
          style={{
            flex: 1,
            backgroundColor: '#94D6B3',
            padding: 15,
            paddingBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {
              setEditModalVisible(false);
            }}
            style={[styles.closeButton, { backgroundColor: 'white' }]}>
            <Icon name={'close'} size={BUTTON_SIZE / 2} />
          </TouchableOpacity>
          <Text
            style={{
              ...styles.title,
              backgroundColor: '#94D6B3',
              marginTop: 10,
              textAlign: 'center',
            }}>
            Edit Project Proposal
          </Text>
          <View
            style={{
              ...stylesForm.form,
              marginTop: 20,
              backgroundColor: '#45B37A',
            }}>
            <TextInput
              multiline={true}
              style={{
                ...stylesForm.descriptionInput,
                backgroundColor: 'white',
              }}
              placeholder="Enter your description"
              value={editDescription}
              onChangeText={setEditDescription}
            />
            <Button
              color="black"
              title="Save"
              onPress={handleEditSubmit}
            />
          </View>
        </KeyboardAwareScrollView>
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
            date={item.date}
            author={item.author}
            image_file={item.images ? item.images[0] : null}
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
    flex: 0,
    flexDirection: 'row',
    backgroundColor: '#94D6B3',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 5,
    borderBottomColor: '#45B37A',
  },
  itemHeaderLast: {
    flex: 1,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 5,
    borderBottomColor: '#999999',
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
    backgroundColor: '#94D6B3',
    fontWeight: '900',
    color: '#000',
  },
  titleFirst: {
    fontSize: 32,
    fontWeight: '900',
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
    alignSelf: 'stretch',
    aspectRatio: 16 / 9,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
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
const stylesDir = StyleSheet.create({
  directionsButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  directionsText: {
    fontSize: 12,
    color: '#007AFF', // Apple Maps-style blue
    fontWeight: '600',
  },
});
