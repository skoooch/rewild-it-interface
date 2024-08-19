import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HeaderComponent from '../navigation/ScrollHeader'
import { Text, View, Button, FlatList, StyleSheet, StatusBar ,Animated } from 'react-native';
export default function Project({ route, navigation }) {
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
        {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
        {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
        {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
        {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
      description: 'Hello blah blah blah blah this is my idea'
    },
    
  ];

  const Item = ({ title, description }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  return (
    <View style={{flex:1}}>
    <FlatList
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll={true}
      data={DATA}
      renderItem={({ item}) => <Item title={item.title} description={item.description} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={HeaderComponent}
    />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});