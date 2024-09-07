import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import FIREBASE_APP from '../App.js'
import { getAuth } from 'firebase/auth';
const AccountScreen = () => {
  const [email, setEmail] = useState('user@example.com');
  const [username, setUsername] = useState('Username');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Your account information has been updated.');
    // Here you could add functionality to save the updated values to a server or local storage
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
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

      {isEditing ? (
        <Button title="Save" onPress={handleSave} />
      ) : (
        <Button title="Edit Profile" onPress={handleEdit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
  },
  value: {
    fontSize: 18,
    color: '#666',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default AccountScreen;
