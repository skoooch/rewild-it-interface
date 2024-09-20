import { initializeApp, getApp, getApps } from "@firebase/app";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
// Import the functions you need from the SDKs you need
import * as SecureStore from "expo-secure-store";
import { onAuthStateChanged } from "@firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAV9vA2i86EEGMHY-opLiKuNC_QLPLNPfg",
  authDomain: "rewild-it-c744b.firebaseapp.com",
  projectId: "rewild-it-c744b",
  storageBucket: "rewild-it-c744b.appspot.com",
  messagingSenderId: "228667685680",
  appId: "1:228667685680:web:5626d50b07499461f726f5",
  measurementId: "G-DDLN8JVZMH",
};

import { refreshIdToken, getCustomToken } from "./screens/utils/helpers";
// // Initialize Firebase

import { getAuth, initializeAuth, signInWithCustomToken } from "firebase/auth";
let FIREBASE_APP, auth;
FIREBASE_APP = initializeApp(firebaseConfig);
auth = initializeAuth(FIREBASE_APP);

import { useState, useEffect } from "react";
import TabNavigator from "./navigation/TabNavigator";
import AuthScreen from "./screens/AuthScreen";
export default function App() {
  [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      let refreshToken = SecureStore.getItem("refreshToken");
      let response = await refreshIdToken(refreshToken);
      let userID = await SecureStore.getItem("currUser");

      if (response != null) {
        await SecureStore.setItemAsync("accessToken", response.access_token);

        session_res = await getCustomToken(response.access_token, userID);
        token = session_res.data.token;
      } else {
        token = "";
      }

      const auth = getAuth(FIREBASE_APP);
      // const FIREBASE_APP = initializeApp(firebaseConfig);
      await signInWithCustomToken(auth, token)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          const uid = user.uid;

          await SecureStore.setItemAsync("currUser", uid);
          await SecureStore.setItemAsync(
            "accessToken",
            userCredential._tokenResponse.idToken
          );
          await SecureStore.setItemAsync(
            "refreshToken",
            userCredential._tokenResponse.refreshToken
          );
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error);
        });

      onAuthStateChanged(auth, (user) => {
        if (user) {
          SecureStore.setItemAsync("currUser", user.uid);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      });
    };
    checkLoginStatus();
  }, []);
  return (
    <>
      {isLoggedIn && <TabNavigator />}
      {!isLoggedIn && <AuthScreen setIsLoggedIn={setIsLoggedIn}/>} 
    </>
  );
}
