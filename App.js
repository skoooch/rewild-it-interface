import { initializeApp, getApp, getApps } from '@firebase/app';
// Import the functions you need from the SDKs you need
import * as SecureStore from 'expo-secure-store';
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from '@firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyAV9vA2i86EEGMHY-opLiKuNC_QLPLNPfg',
  authDomain: 'rewild-it-c744b.firebaseapp.com',
  projectId: 'rewild-it-c744b',
  storageBucket: 'rewild-it-c744b.appspot.com',
  messagingSenderId: '228667685680',
  appId: '1:228667685680:web:5626d50b07499461f726f5',
  measurementId: 'G-DDLN8JVZMH',
};

import {
  refreshIdToken,
  getCustomToken
} from './screens/utils/helpers';
// // Initialize Firebase

import {
  getAuth,
  initializeAuth,
  signInWithCustomToken,
  getReactNativePersistence,
} from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
const reactNativePersistence = firebaseAuth.getReactNativePersistence;
import { AsyncStorage } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
let FIREBASE_APP, auth;
FIREBASE_APP = initializeApp(firebaseConfig);
auth = initializeAuth(FIREBASE_APP);

import { useState, useEffect } from 'react';
import TabNavigator from './navigation/TabNavigator';
import AuthScreen from './components/AuthScreen';
export default function App() {
  [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      
      let refreshToken = SecureStore.getItem("refreshToken");
      console.log(refreshToken);
      let response = await refreshIdToken(refreshToken);
      let userID = await SecureStore.getItem('currUser');
      console.log(response)

      if (response != null) {
        await SecureStore.setItemAsync(
            'accessToken',
            response.access_token
          );

          session_res = await getCustomToken(response.access_token, userID)
          token = session_res.data.token
          
      } else {
        token=""
      }

      const auth = getAuth(FIREBASE_APP)
      // const FIREBASE_APP = initializeApp(firebaseConfig);
      await signInWithCustomToken(auth, token)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          const uid = user.uid;
          console.log(userCredential);
          console.log(user);
          
          await SecureStore.setItemAsync('currUser', uid);
          await SecureStore.setItemAsync(
            'accessToken',
            userCredential._tokenResponse.idToken
          );
          await SecureStore.setItemAsync('refreshToken', userCredential._tokenResponse.refreshToken);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error)
        });

      onAuthStateChanged(auth, (user) => {
        if (user) {
          SecureStore.setItemAsync('currUser', user.uid);
          setIsLoggedIn(true);
          console.log("POOP A")
        } else {

          setIsLoggedIn(false);
          console.log("POOP B")
        }
      });
    };
    checkLoginStatus();
  }, []);
  return (
    <>
      {isLoggedIn ? (
        <TabNavigator />
      ) : (
        <AuthScreen setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}
