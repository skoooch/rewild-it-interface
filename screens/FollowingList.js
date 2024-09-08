import * as React from "react";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchDataGET } from "./utils/helpers";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
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
  TouchableHighlight,
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
export default function FollowingList() {
  const isFocused = useIsFocused();
  const [userObj, setUserObj] = useState({});
  const [goToProj, setGoToProj] = useState("");
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const getProjects = async () => {
    setRefreshing(true);
    let currUser = await SecureStore.getItemAsync("currUser");
    const user_object = await fetchDataGET(`user/${currUser}/`, {});
    setUserObj(user_object.data);
    let temp_data = [];
    for (let i = 0; i < user_object.data.follows.length; i++) {
      const proj_response = await fetchDataGET(
        `project/${user_object.data.follows[i]}/`
      );
      const infoUnformatted = proj_response.data.timeline.posts[0];
      const date = new Date(infoUnformatted.created_ts.split("T")[0]);
      let author = "";
      if (infoUnformatted.author_id) {
        const author_object = await fetchDataGET(
          `user/${infoUnformatted.author_id}/`
        );
        author = author_object.data.username;
      }
      temp_data.push({
        id: user_object.data.follows[i],
        title: proj_response.data.name,
        description: proj_response.data.description,
        author: author,
        date: `${date.toLocaleString("default", {
          month: "long",
        })} ${date.getDay()}, ${date.getFullYear()}`,
      });
    }
    setData(temp_data);
    setRefreshing(false);
  };
  useEffect(() => {
    if (isFocused) getProjects();
  }, [isFocused]);
  React.useEffect(() => {
    const navigateToProj = async () => {
      let currUser = await SecureStore.getItemAsync("currUser");
      if (goToProj != "") {
        navigation.navigate("View Project", {
          project_id: goToProj,
          currUser: currUser,
        });
        setGoToProj("");
      }
    };
    navigateToProj();
  }, [goToProj, navigation]);
  const Item = ({ id, description, title, author, date }) => (
    <View>
      <TouchableHighlight onPress={() => setGoToProj(id)}>
        <View style={styles.item}>
          <View style={styles.itemHeader}>
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                minWidth: "100%",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  backgroundColor: "#ffffff",
                  color: "#606060",
                }}
              >
                {`Created ${date}`}
              </Text>
              <Icon
                reverse={true}
                style={{ alignSelf: "flex-start" }}
                name="dots-horizontal"
                size={30}
                color="b0b0b0"
              />
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.itemDescription}>
            <View
              style={{
                padding: 10,
                paddingBottom: 0,
                borderRadius: 5,
                backgroundColor: "#ffffff",
              }}
            >
              <Text numberOfLines={3} style={styles.description}>
                {description}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Text
        style={{
          fontSize: 40,
          textAlign: "center",
          paddingVertical: 20,
          color: "#010101",
          fontWeight: "900",
        }}
      >
        My Projects
      </Text>
      <FlatList
        data={data}
        refreshing={refreshing}
        onRefresh={getProjects}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            id={item.id}
            description={item.description}
            author={item.author}
            date={item.date}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 3,
    borderBottomWidth: 1,
    borderColor: "#909090",
  },
  itemHeader: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomColor: "#000000",
  },
  title: {
    fontSize: 25,
    backgroundColor: "ffffff",
  },
  description: {
    fontSize: 16,
  },
  itemDescription: {},
});
