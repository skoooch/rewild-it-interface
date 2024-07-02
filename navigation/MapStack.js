import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Map from '../screens/Map';
import AddProjectMap from '../screens/AddProjectMap';
const Stack = createStackNavigator();

export default function MapStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen
        name="Add Project"
        options={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'green' },
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}>
        {(props) => <AddProjectMap {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
