import * as React from 'react';
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchDataGET } from './utils/helpers';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import {
  Text,
  View,
  Button,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableHighlight,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
const marker = {
  latitude: 43.65005,
  longitude: -79.401,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};
const BUTTON_SIZE = 35;
const BORDER_WIDTH = 1;
export default function FollowingList() {
  const isFocused = useIsFocused();
  const currUser = '919170fd-8986-4b01-8d99-7a88bf2c5aac';
  const [userObj, setUserObj] = useState({});
  const [goToProj, setGoToProj] = useState('');
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const getProjects = async () => {
    let currUser = await SecureStore.getItemAsync('currUser');
    const user_object = await fetchDataGET(`user/${currUser}/`, {
    });
    setUserObj(user_object.data);
    let temp_data = [];
    for (let i = 0; i < user_object.data.follows.length; i++) {
      const proj_response = await fetchDataGET(
        `project/${user_object.data.follows[i]}/`
      );
      console.log(proj_response);
      temp_data.push({
        id: user_object.data.follows[i],
        title: proj_response.data.name,
        description: proj_response.data.description,
      });
    }
    setData(temp_data);
  };
  useEffect(() => {
    if (isFocused) getProjects();
  }, [isFocused]);
  React.useEffect(() => {
    if (goToProj != '') {
      console.log(goToProj);
      navigation.navigate('View Project', {
        project_id: goToProj,
        currUser: currUser,
      });
      setGoToProj('');
    }
  }, [goToProj, navigation]);
  const Item = ({ id, description, title }) => (
    <TouchableHighlight onPress={() => setGoToProj(id)}>
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              minWidth: '100%',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 12,
                backgroundColor: '#ffffff',
                color: '#606060',
              }}>
              {`April 18th, 2024 by ${userObj.username}`}
            </Text>
            <Icon
              reverse={true}
              style={{ alignSelf: 'flex-start' }}
              name="dots-horizontal"
              size={30}
              color="b0b0b0"
            />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.itemDescription}>
          <View
            style={{
              padding: 10,
              paddingBottom: 0,
              borderRadius: 5,
              backgroundColor: '#ffffff',
            }}>
            <Text numberOfLines={3} style={styles.description}>
              {description}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            id={item.id}
            description={item.description}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 3,
    borderBottomWidth: 1,
    borderColor: '#909090',
  },
  itemHeader: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomColor: '#000000',
  },
  title: {
    fontSize: 25,
    backgroundColor: 'ffffff',
  },
  description: {
    fontSize: 16,
  },
  itemDescription: {},
});
