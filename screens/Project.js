import * as React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
const GLOBAL = require("../Global");
import { fetchDataGET } from "./utils/helpers";
import HeaderComponent from "../navigation/ScrollHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MapView from "react-native-maps";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  Text,
  View,
  Button,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
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
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  // let project = route.params.project;
  const currUser = "7c441471-befb-482d-a061-f93279c0d6e0";
  // currUser = route.params.currUser; 227b6720-17cf-4d55-88c6-283a97340ba5
  // delete once projs are working
  const [project, setProject] = useState({});
  const getProject = async () => {
    const project_res = await fetchDataGET(
      `project/${route.params.project_id}`
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
        date: "April 30th, 2027",
      };
      const user_object = await fetchDataGET(
        `user/${"7c441471-befb-482d-a061-f93279c0d6e0"}`
      );
      setFollowing(
        user_object.data.follows.includes(project_res.data.project_id)
      );
      setData([projectInfo]);
    } else {
      setProject([]);
    }
  };
  useEffect(() => {
    getProject();
  }, [following]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    if (!title) errors.title = "Title is required";
    if (!description) errors.description = "Description is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };
  const addMarkerPress = () => {
    setModalVisible(true);
  };
  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Submitted", title, description);
      setTitle("");
      setDescription("");
      setErrors({});
    }
  };
  const imageUpload = () => {
    return;
  };
  const Item = ({ title, description, prev_id, latitude, longitude }) => (
    <View>
      {prev_id == null && (
        <View style={styles.itemFirst}>
          <View style={styles.itemHeaderFirst}>
            <Text style={styles.titleFirst}>{title}</Text>
            <Text
              style={{
                fontSize: 12,
                backgroundColor: "#ffffff",
                paddingTop: 0,
                color: "#606060",
              }}
            >
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
              }}
            >
              <Marker
                key={0}
                coordinate={{ latitude: latitude, longitude: longitude }}
              />
            </MapView>
          </View>

          <View style={styles.itemDescriptionFirst}>
            <View
              style={{
                padding: 10,
                borderRadius: 5,
                backgroundColor: "#f0f0f0",
              }}
            >
              <Text style={styles.description}>{description}</Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 40,
              backgroundColor: "#ffffff",
              textAlign: "center",
              paddingTop: 15,
              color: "#606060",
              fontStyle: "italic",
              textDecorationLine: "underline",
            }}
          >
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
                backgroundColor: "#dddddd",
                paddingTop: 0,
                color: "#606060",
              }}
            >
              April 18th, 2024 by JOhnnyWild
            </Text>
          </View>
          <View style={{ flex: 1 }}></View>
          <View style={styles.itemDescription}>
            <View
              style={{
                padding: 10,
                borderRadius: 5,
                backgroundColor: "#f0f0f0",
              }}
            >
              <Text style={styles.description}>{description}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: "lightblue", padding: 15 }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={[styles.closeButton, { backgroundColor: "white" }]}
          >
            <Icon name={"close"} size={BUTTON_SIZE / 2} />
          </TouchableOpacity>
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={stylesForm.container}
          >
            <View style={stylesForm.form}>
              <Text style={stylesForm.label}>Post Title</Text>
              <TextInput
                style={stylesForm.input}
                placeholder="Enter your title"
                value={title}
                onChangeText={setTitle}
              />
              <Text style={stylesForm.label}>Upload Images</Text>
              <Button title="Upload Image" onPress={imageUpload} />
              {errors.title ? (
                <Text style={stylesForm.errorText}>{errors.title}</Text>
              ) : null}

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
          position: "absolute", //use absolute position to show button on top of the map
          top: "91%", //for center align
          alignSelf: "flex-end",
          paddingRight: 22,
        }}
      >
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
    backgroundColor: "#ffffff",
    padding: 0,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: "#000000",
  },
  itemHeader: {
    flex: 1,
    backgroundColor: "#dddddd",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 3,
    borderBottomColor: "#000000",
  },
  itemFirst: {
    backgroundColor: "#ffffff",
    padding: 0,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: "#000000",
  },
  buttonAdd: {
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#BC96E6",
  },
  itemHeaderFirst: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
    paddingBottom: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 3,
    borderBottomColor: "#909090",
  },
  title: {
    fontSize: 32,
    backgroundColor: "#dddddd",
  },
  titleFirst: {
    fontSize: 32,
    fontWeight: "bold",
    backgroundColor: "#ffffff",
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
    borderBottomColor: "#909090",
  },
  formContainer: {
    height: 275,
    paddingTop: 10,
  },
  map: {
    flex: 1,
  },
  formMap: {
    paddingTop: 20,
    borderRadius: 20,
    paddingBottom: 20,
    flex: 1,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: BUTTON_SIZE + BORDER_WIDTH,
    height: BUTTON_SIZE + BORDER_WIDTH,
    borderWidth: BORDER_WIDTH,
    borderRadius: BUTTON_SIZE / 2,
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
