import * as React from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
const GLOBAL = require("../Global");
import HeaderComponent from "../navigation/ScrollHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MapView from "react-native-maps";
import Carousel from "react-native-reanimated-carousel";
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
  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      prev_id: "00000000-0000-0000-0000-000000000000",
      title: "Rewilding idea here",
      description:
        "The Riverbend Meadow Restoration project aims to revive and protect a 15-acre meadow located along the Riverbend Nature Reserve. This area, once rich with native wildflowers, grasses, and diverse wildlife, has suffered from years of neglect, invasive species, and habitat degradation. \n \n Our goal is to restore the meadow to its natural state, creating a thriving habitat for pollinators like bees and butterflies, as well as providing a sanctuary for ground-nesting birds and small mammals. We plan to achieve this by removing invasive species, reseeding with native plants, and reintroducing key species that have been lost over time.",
      date: "April 30th, 2027",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      prev_id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "Timeline post 1",
      description:
        "We’ve made great progress in our meadow restoration project! This week, we completed the weeding across 3 acres to prepare the soil for native plants. We successfully planted a mix of wildflowers and grasses, ensuring even seed distribution. Soil tests were conducted to check nutrient levels and pH balance, confirming optimal conditions for seed germination. The weather has been mild with occasional rain, which is perfect for the seeds to start sprouting. Over the next two weeks, we’ll be monitoring the germination process closely and will keep the area well-watered, especially during any dry spells. Our next focus will be introducing beneficial insects to support pollination. By restoring this meadow, we’re creating a thriving habitat for local wildlife, including bees, butterflies, and ground-nesting birds. A huge thank you to our volunteers for their incredible work—your efforts are making a significant impact on our rewilding journey!",
      date: "April 30th, 2027",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      prev_id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "Timeline post 2",
      description:
        "The grassland restoration is entering its next phase. We’ve successfully completed the initial clearing and have just started planting native grasses that are well-suited to the area. These grasses will help restore the natural balance of the ecosystem and provide habitat for ground-nesting birds and other wildlife. We’ll be keeping a close eye on the planting over the next few months and will need volunteers for upcoming maintenance tasks. This is a critical step in preserving our grasslands, and we appreciate everyone’s ongoing support!",
      date: "April 30th, 2027",
    },
  ];
  const [following, setFollowing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [carouselWidth, setCarouselWidth] = useState(10);
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
  const Item = ({ title, description, prev_id, currLocation }) => (
    <View>
      {prev_id == GLOBAL.NULL_UUID && (
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
                latitude: marker.latitude,
                longitude: marker.longitude,
                latitudeDelta: 0.007,
                longitudeDelta: 0.007,
              }}
            >
              <Marker key={0} coordinate={marker} />
            </MapView>
          </View>
          <View
            onLayout={({ nativeEvent }) => {
              const { x, y, width, height } = nativeEvent.layout;
              setCarouselWidth(width);
            }}
            style={{ flex: 1, padding: 10 }}
          >
            <Carousel
              loop
              width={carouselWidth}
              height={carouselWidth / 2}
              data={[...new Array(6).keys()]}
              scrollAnimationDuration={1000}
              renderItem={({ index }) => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ textAlign: "center", fontSize: 30 }}>
                    {index}
                  </Text>
                </View>
              )}
            />
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
      {prev_id != GLOBAL.NULL_UUID && (
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
          <View
            onLayout={({ nativeEvent }) => {
              const { x, y, width, height } = nativeEvent.layout;
              setCarouselWidth(width);
            }}
            style={{ flex: 1, padding: 10 }}
          >
            <Carousel
              loop
              width={carouselWidth}
              height={carouselWidth / 2}
              data={[...new Array(6).keys()]}
              scrollAnimationDuration={1000}
              renderItem={({ index }) => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ textAlign: "center", fontSize: 30 }}>
                    {index}
                  </Text>
                </View>
              )}
            />
          </View>
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
        data={DATA}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            prev_id={item.prev_id}
            description={item.description}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <HeaderComponent following={following} setFollowing={setFollowing} />
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
