import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import SignUp from '../components/SignUp';
import AuthScreen from '../components/AuthScreen';
const Stack = createStackNavigator();
export default function LoginStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Login'}>
        <Stack.Screen
          name="Login"
          component={AuthScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Sign Up"
          component={SignUp}
          options={{
            headerShown: false,
          }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
