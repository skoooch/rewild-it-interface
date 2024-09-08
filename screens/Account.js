import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import FIREBASE_APP from "../App.js";
import { getAuth } from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { fetchDataGET } from "./utils/helpers";
import RNRestart from "react-native-restart"; // Import package from node modules

const logOut = async () => {
  await SecureStore.deleteItemAsync("currUser");
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  RNRestart.restart();
};

const AccountScreen = () => {
  const [email, setEmail] = useState("user@example.com");
  const [username, setUsername] = useState("username");
  const [fullName, setFullName] = useState("John Doe");
  const [isEditing, setIsEditing] = useState(false);

  (async () => {
    let currUser = await SecureStore.getItemAsync("currUser");
    fetchDataGET(`user/${currUser}/`).then((res) => {
      setEmail(res.data.email);
      setUsername(res.data.username);
      setFullName(res.data.first_name + " " + res.data.last_name);
    });
  })();

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Success", "Your account information has been updated.");
    // Here you could add functionality to save the updated values to a server or local storage
  };
  const ProfilePic = ({ letter = "" }) => {
    return (
      <View style={styles.profileImg}>
        <Text style={styles.profileText}>{letter.toUpperCase()}</Text>
      </View>
    );
  };
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <ProfilePic letter={username[0]}></ProfilePic>
        <Text
          style={{
            fontSize: 40,
            textAlign: "center",
            paddingVertical: 30,
            color: "#010101",
            fontWeight: "900",
          }}
        >
          {fullName}
        </Text>
      </View>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.value}>{email}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Username:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.value}>{username}</Text>
          )}
        </View>

        <Button
          title="Log out"
          style={{ color: "red", fontWeight: "bold" }}
          onPress={logOut}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginRight: 10,
  },
  value: {
    fontSize: 18,
    color: "#666",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flex: 1,
  },
  profileImg: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "seagreen",
  },
  profileText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
});

export default AccountScreen;
