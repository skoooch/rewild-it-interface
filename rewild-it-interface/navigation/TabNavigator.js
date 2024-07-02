import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Discussion from '../screens/Discussion'
import MapStack from './MapStack'
import Account from '../screens/Account'
const Tab = createBottomTabNavigator();
const TabNavigator = (props) => {
  const MyTabs = (props) => {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Map"
          component={MapStack}
        />
        <Tab.Screen
          name="Discussion"
          component={Discussion}
        />
        <Tab.Screen
          name="Account"
          component={Account}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
export default TabNavigator
