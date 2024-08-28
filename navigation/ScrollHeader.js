import React from 'react';
import {StyleSheet, Text, View} from 'react-native';


const Header = (props) => {
  const {headerHeight} = props;
  return (
    <>
          <View
        style={[
          styles.subHeader,
          {
            height: 60,
          },
        ]}>
      </View>
      <View
        style={[
          styles.subHeader,
          {
            height: 60,
          },
        ]}>

        <Text style={styles.conversation}>Timeline</Text>

      </View>

    </>
  );
};

const styles = StyleSheet.create({
  subHeader: {
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#1c1c1c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversation: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  searchText: {
    color: '#8B8B8B',
    fontSize: 17,
    lineHeight: 22,
    marginLeft: 8,
  },
  searchBox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#0F0F0F',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
export default Header;