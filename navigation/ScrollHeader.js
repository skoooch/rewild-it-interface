import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Header({ following, setFollowing }) {
  const clickFollow = () => {
    setFollowing(!following);
  };
  return (
    <>
      <View
        style={[
          styles.subHeader,
          {
            height: 60,
          },
        ]}
      ></View>
      <View
        style={[
          styles.subHeader,
          {
            height: 60,
          },
        ]}
      >
        <TouchableOpacity onPress={clickFollow}>
          {following ? (
            <Text
              style={{
                fontSize: 14,
                borderWidth: 2,
                borderRadius: 10,
                borderColor: "#101010",
                backgroundColor: "#101010",
                color: "#f0f0f0",
              }}
            >
              Following
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 14,
                borderWidth: 2,
                borderRadius: 10,
                borderColor: "#f0f0f0",
                backgroundColor: "#f0f0f0",
                color: "#101010",
              }}
            >
              Follow
            </Text>
          )}
        </TouchableOpacity>
        <Text style={styles.conversation}>Timeline</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  subHeader: {
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#1c1c1c",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversation: { color: "white", fontSize: 16, fontWeight: "bold" },
  searchText: {
    color: "#8B8B8B",
    fontSize: 17,
    lineHeight: 22,
    marginLeft: 8,
  },
  searchBox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#0F0F0F",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
