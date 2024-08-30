import * as React from "react";
import { useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
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
  const [goToProj, setGoToProj] = useState("");
  const navigation = useNavigation();
  React.useEffect(() => {
    if (goToProj != "") {
      navigation.navigate("View Project", { projectId: goToProj });
    }
  }, [goToProj, navigation]);
  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "Rewilding idea here",
      description:
        "The Riverbend Meadow Restoration project aims to revive and protect a 15-acre meadow located along the Riverbend Nature Reserve. This area, once rich with native wildflowers, grasses, and diverse wildlife, has suffered from years of neglect, invasive species, and habitat degradation. \n \n Our goal is to restore the meadow to its natural state, creating a thriving habitat for pollinators like bees and butterflies, as well as providing a sanctuary for ground-nesting birds and small mammals. We plan to achieve this by removing invasive species, reseeding with native plants, and reintroducing key species that have been lost over time.",
      date: "April 30th, 2027",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Project 2",
      description:
        "We’ve made great progress in our meadow restoration project! This week, we completed the weeding across 3 acres to prepare the soil for native plants. We successfully planted a mix of wildflowers and grasses, ensuring even seed distribution. Soil tests were conducted to check nutrient levels and pH balance, confirming optimal conditions for seed germination. The weather has been mild with occasional rain, which is perfect for the seeds to start sprouting. Over the next two weeks, we’ll be monitoring the germination process closely and will keep the area well-watered, especially during any dry spells. Our next focus will be introducing beneficial insects to support pollination. By restoring this meadow, we’re creating a thriving habitat for local wildlife, including bees, butterflies, and ground-nesting birds. A huge thank you to our volunteers for their incredible work—your efforts are making a significant impact on our rewilding journey!",
      date: "April 30th, 2027",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Project 3",
      description:
        "The grassland restoration is entering its next phase. We’ve successfully completed the initial clearing and have just started planting native grasses that are well-suited to the area. These grasses will help restore the natural balance of the ecosystem and provide habitat for ground-nesting birds and other wildlife. We’ll be keeping a close eye on the planting over the next few months and will need volunteers for upcoming maintenance tasks. This is a critical step in preserving our grasslands, and we appreciate everyone’s ongoing support!",
      date: "April 30th, 2027",
    },
  ];
  const Item = ({ id, description, title }) => (
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
              April 18th, 2024 by JOhnnyWild
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
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            id={item.id}
            description={item.description}
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
