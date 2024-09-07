import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getAuth, signInWithCustomToken } from '@firebase/auth';
import * as SecureStore from 'expo-secure-store';
import {
  fetchDataGET,
  fetchDataPOST,
  fetchDataLOGIN,
} from '../screens/utils/helpers';

//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });
// setPersistence(auth, ReactNativeAsyncStorage)
//   .then(() => {
//     // Existing and future Auth states are now persisted in the current
//     // session only. Closing the window would clear any existing state even
//     // if a user forgets to sign out.
//     // ...
//     // New sign-in will be persisted with session persistence.
//     console.log("HERE")
//     return true;
//   })
//   .catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log("OR HERE")
//   });
export default function AuthScreen({ setIsLoggedIn }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleAuth = async () => {
    try {
      if (isSignup) {
        // TODO: Add signup logic
        // Assume successful signup and obtain token
        var create_response = await fetchDataPOST(`user`, {
          username: username,
          password: password,
          email: email,
        });
        const token = '';
        await SecureStore.setItemAsync('authToken', token);
      }
      var authResponse = await fetchDataLOGIN(`login`, {
        username: username,
        password: password,
      });
      const token = authResponse.token;
      console.log(token)
      const auth = getAuth()
      // const FIREBASE_APP = initializeApp(firebaseConfig);
      await signInWithCustomToken(auth, token)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          const uid = user.uid;          
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
          Alert.alert(error);
        });

      // Assume successful login and obtain token
      // const token = 'sample-login-token';
      Alert.alert(
        isSignup ? 'Sign Up' : 'Log In',
        'Authentication successful.'
      );
      console.log(auth.currentUser);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during authentication:', error);
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  };
  const toggleAuthMode = () => {
    setIsSignup((prevMode) => !prevMode);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignup ? 'Sign Up' : 'Log In'}</Text>
      {isSignup ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={isSignup ? 'Sign Up' : 'Log In'} onPress={handleAuth} />
      <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isSignup
            ? 'Already have an account? Log In'
            : 'Need an account? Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
});
