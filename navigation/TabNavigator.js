import * as React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import FollowingList from '../screens/FollowingList'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapStack from './MapStack';
import MapStackFollowing from './MapStackFollowing';
import Account from '../screens/Account';
const Tab = createBottomTabNavigator();
const TabNavigator = (props) => {
  const MyTabs = (props) => {
    return (
      // <KeyboardAvoidingView
      //   behavior="padding"
      //   style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
        <Tab.Navigator
        initialRouteName={"Map"}
          screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarInactiveTintColor: 'white',
            tabBarActiveTintColor: '#F3BCF5',
            tabBarStyle: {
              backgroundColor: '#45B37A',
              height: 100
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
                  return (
                    <Icon
                      style={{ paddingTop: 10 }}
                      name="map"
                      size={40}
                      color="white"
                    />
                  );
                }
              },
            }}
          />
          <Tab.Screen
            name="FollowingList"
            component={MapStackFollowing}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => {
                if (focused) {
                  return (
                    <Icon
                      style={{ paddingTop: 10 }}
                      name="star-box-multiple-outline"
                      size={40}
                      color="#F3BCF5"
                    />
                  );
                } else {
                  return (
                    <Icon
                      style={{ paddingTop: 10 }}
                      name="star-box-multiple-outline"
                      size={40}
                      color="white"
                    />
                  );
                }
              },
            }}
          />
          <Tab.Screen
            name="Account"
            component={Account}
            options={{
              headerShown:true,
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
                  return (
                    <Icon
                      style={{ paddingTop: 10 }}
                      name="account"
                      size={40}
                      color="white"
                    />
                  );
                }
              },
            }}
          />
          
        </Tab.Navigator>
      // </KeyboardAvoidingView>
    );
  };
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
};
export default TabNavigator;
