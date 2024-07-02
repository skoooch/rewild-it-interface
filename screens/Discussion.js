import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, Pressable, View, StyleSheet, Button} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { toggleOn, toggleOff} from '../store/actions/swap';

export default function Discussion () {
  return (
    <View>
      <Text>Discussion</Text>
      <Pressable style={styles.button}>
      <Text style={styles.text}>penis</Text>
    </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});