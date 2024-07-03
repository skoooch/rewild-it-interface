import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { View, Image } from 'react-native';
import Map from '../screens/Map';
import AddProjectMap from '../screens/AddProjectMap';
import AddProjectModal from '../screens/AddProjectModal';
import Project from '../screens/Project';
const Stack = createStackNavigator();
function LogoTitle() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingBottom:10
      }}>
      <Image
        style={{
          width: '75%',
          resizeMode: 'contain',
          height: undefined,
          aspectRatio: 1,
        }}
        source={require('../assets/text_transp.png')}
      />
    </View>
  );
}
export default function MapStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Map"
        component={Map}
        options={{
          headerTintColor: 'white',
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: '#94D6B3',
            borderBottomColor: '#45B37A',
            borderBottomWidth: 5,
          },
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
      <Stack.Screen
        name="Add Project"
        options={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '#45B37A',
            borderBottomColor: '#F2D8F9'},
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}>
        {(props) => <AddProjectMap {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="View Project"
        options={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'green' },
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}>
        {(props) => <Project {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Add Project Modal"
        options={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'green' },
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}>
        {(props) => <AddProjectModal {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
