import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIREBASE_APP from '../App.js'
import { Dimensions } from 'react-native';
import { fetchDataDELETE, fetchDataPOST } from '../screens/utils/helpers';
import { useNavigation } from '@react-navigation/native';
export default function Header({
  following,
  setFollowing,
  num_followers,
  discussion_board,
  project_id,
  user_id,
}) {

  const navigation = useNavigation();
  const clickFollow = async () => {
    const follow_change = !following;
    console.log(user_id)
    if (follow_change) {
      const response = await fetchDataPOST(`project/${project_id}/follow`, {
        user_id: user_id,
      });
      console.log(response)
    } else {
      await fetchDataDELETE(`project/${project_id}/follow`, {
        user_id: user_id,
      });
    }
    console.log(following)
    setFollowing(follow_change);
    console.log(following)
  };
  const width = Dimensions.get('window').width / 3;
  const viewDiscussion = () => {
    navigation.navigate('Project Discussion', { project_id: project_id, currUser: user_id });
  };
  return (
    <>
      <View
        style={[
          styles.subHeader,
          {
            height: 50,
          },
        ]}></View>
      <View style={{ paddingRight: 4, backgroundColor: '#1c1c1c' }}>
        <View style={{ ...styles.subHeaderItem }}>
          <View
            style={{
              width: width * 1.5,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text
              style={{
                padding: 5,
                alignSelf: 'auto',
                fontSize: 40,
                fontWeight: 'bold',
                color: '#45B37A',
              }}>
              {num_followers}
            </Text>
            <Text
              style={{
                alignSelf: 'flex-end',
                fontSize: 12,
                fontWeight: 'bold',
                color: '#f1f1f1',
                paddingBottom: 15,
              }}>
              Interested
            </Text>
          </View>
          <View
            style={{
              width: 'auto',
              padding: 7,
              paddingRight: 15,
              borderRightWidth: 2,
              borderColor: '#808080',
            }}>
            <TouchableOpacity
              style={{ flexWrap: 'wrap' }}
              onPress={clickFollow}>
              {following ? (
                <View
                  style={{
                    padding: 5,
                    borderWidth: 2,
                    borderRadius: 15,
                    marginLeft: 2,
                    borderColor: '#45B37A',
                    backgroundColor: '#45B37A',
                    alignSelf: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#f1f1f1',
                    }}>
                    - Interested
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    padding: 5,

                    borderWidth: 2,
                    borderRadius: 15,
                    borderColor: '#45B37A',
                    backgroundColor: '#101010',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#f1f1f1',
                    }}>
                    + Interested
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.subHeaderItemRight}>
            <TouchableOpacity onPress={viewDiscussion}>
              <View
                style={{
                  paddingLeft: 15,
                }}>
                <Icon
                  reverse={true}
                  name="comment-text-multiple-outline"
                  size={30}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  subHeader: {
    width: '100%',
    paddingHorizontal: 100,
    marginHorizontal: 'auto',
    backgroundColor: '#1c1c1c',
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60,
  },
  subHeaderItem: {
    marginHorizontal: 'auto',
    paddingLeft: 10,
    backgroundColor: '#1c1c1c',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60,
  },
  subHeaderItemRight: {
    marginHorizontal: 'auto',
    backgroundColor: '#1c1c1c',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 60,
  },
  conversation: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});
