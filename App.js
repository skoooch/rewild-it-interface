import { useState, useEffect } from "react";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { Text, View, StyleSheet } from "react-native";
import { Provider, useSelector } from "react-redux";
import TabNavigator from "./navigation/TabNavigator";
import LoginStack from "./navigation/LoginStack";
import Discussion from "./screens/Discussion";
import Project from "./screens/Project";

import { initializeApp } from "@firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "@firebase/auth";

let app = initializeApp({
  apiKey: "AIzaSyAV9vA2i86EEGMHY-opLiKuNC_QLPLNPfg",
  authDomain: "rewild-it-c744b.firebaseapp.com",
  projectId: "rewild-it-c744b",
  storageBucket: "rewild-it-c744b.appspot.com",
  messagingSenderId: "228667685680",
  appId: "1:228667685680:web:5626d50b07499461f726f5",
  measurementId: "G-DDLN8JVZMH",
});

export const auth = getAuth(app);

const email = "ewan.jordan30@gmail.com";
const password = "peepeepoopoo123";

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, function (user) {
      console.log("onAuthStateChanged");
      if (user) {
        console.log("Signed in.");
        setUser(user);
        console.log("uid: " + user.uid);
      } else {
        console.log("Signed out.");
      }
    });
  });
  return <>{user ? <TabNavigator /> : <TabNavigator />}</>;
}
