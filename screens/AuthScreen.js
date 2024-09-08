import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { getAuth, signInWithCustomToken } from '@firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { fetchDataGET, fetchDataPOST, fetchDataLOGIN } from './utils/helpers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default function AuthScreen({ setIsLoggedIn }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const handleAuth = async () => {
    try {
      if (isSignup) {
        // TODO: Add signup logic
        // Assume successful signup and obtain token
        var create_response = await fetchDataPOST(`user`, {
          first_name: firstName,
          last_name: lastName,
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
      console.log(token);
      const auth = getAuth();
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
          await SecureStore.setItemAsync(
            'refreshToken',
            userCredential._tokenResponse.refreshToken
          );
          console.log(auth.currentUser);
          setIsLoggedIn(true);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          Alert.alert(error);
        });

      // Assume successful login and obtain token
      // const token = 'sample-login-token';
    } catch (error) {
      console.error('Error during authentication:', error);
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  };
  const toggleAuthMode = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setFirstName('');
    setLastName('');
    setIsSignup((prevMode) => !prevMode);
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          <Image
            style={{
              width: '90%',
              resizeMode: 'contain',
            }}
            source={require('../assets/text_transp.png')}
          />
        </View>

        {isSignup ? (
          <>
            <TextInput
              placeholderTextColor="#bbb"
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="none"
            />
            <TextInput
              placeholderTextColor="#bbb"
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="none"
            />
            <TextInput
              placeholderTextColor="#bbb"
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholderTextColor="#bbb"
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </>
        ) : (
          <TextInput
            placeholderTextColor="#bbb"
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}
        <TextInput
          placeholderTextColor="#bbb"
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title={isSignup ? 'Sign up' : 'Log in'} onPress={handleAuth} />
        <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {isSignup
              ? 'Already have an account? Log in'
              : 'Need an account? Sign up'}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    paddingTop: 50,
    padding: 15,
    backgroundColor: '#94D6B3',
    color: '#000000',
    borderTopWidth: 70,
    borderTopColor: '#45B37A',
    borderBottomWidth: 70,
    borderBottomColor: '#45B37A',
  },
  input: {
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000',
    fontWeight: '600',
    fontSize: 25,
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
