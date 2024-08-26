import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Discussion from '../screens/Discussion';
import MapStack from './MapStack';
import Account from '../screens/Account';
const Tab = createBottomTabNavigator();
const TabNavigator = (props) => {
  const MyTabs = (props) => {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarInactiveTintColor: 'white',
          tabBarActiveTintColor: '#F3BCF5',
          tabBarStyle: {
            backgroundColor: '#45B37A',
          },
        }}>
        <Tab.Screen
          name="Map"
          component={MapStack}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => {
              if (focused) {
                return (
                  <Icon
                    name="map"
                    style={{ paddingTop: 10 }}
                    size={40}
                    color="#F3BCF5"
                  />
                );
              } else {
                return <Icon style={{ paddingTop: 10 }} name="map" size={40} color="white" />;
              }
            },
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => {
              if (focused) {
                return (
                  <Icon
                    style={{ paddingTop: 10 }}
                    name="account"
                    size={40}
                    color="#F3BCF5"
                  />
                );
              } else {
                return <Icon style={{ paddingTop: 10 }} name="account" size={40} color="white" />;
              }
            },
          }}
        />
      </Tab.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
};
export default TabNavigator;
