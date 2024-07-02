import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, Button} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { toggleOn, toggleOff} from '../store/actions/swap';

export default function Account () {
  return (
    <View>
      <Text>Account</Text>
    </View>
  );
}