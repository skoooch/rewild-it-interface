import * as React from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import HeaderComponent from "../navigation/ScrollHeader";
import Carousel from "react-native-reanimated-carousel";
import {
  Text,
  View,
  Button,
  FlatList,
  Dimensions,
  StyleSheet,
  StatusBar,
  Animated,
} from "react-native";
export default function Project({ route, navigation }) {
  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      description: "Hello blah blah blah blah this is my idea",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      description: "Hello blah blah blah blah this is my idea",
    },
  ];
  const [carouselWidth, setCarouselWidth] = useState(10);
  const Item = ({ title, description }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.title}>{title}</Text>
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
              <Text style={{ textAlign: "center", fontSize: 30 }}>{index}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.itemDescription}>
        <View
          style={{ padding: 10, borderRadius: 5, backgroundColor: "#f0f0f0" }}
        >
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#94D6B3" }}>
      <FlatList
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}
        data={DATA}
        renderItem={({ item }) => (
          <Item title={item.title} description={item.description} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={HeaderComponent}
      />
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
  title: {
    fontSize: 32,
    backgroundColor: "#dddddd",
  },
  description: {
    fontSize: 16,
  },
  itemDescription: {
    padding: 10,
  },
});
