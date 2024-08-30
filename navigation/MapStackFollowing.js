import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { View, Image } from "react-native";
import Discussion from "../screens/Discussion";
import FollowingList from "../screens/FollowingList";
import Project from "../screens/Project";
const Stack = createStackNavigator();
function LogoTitle() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingBottom: 10,
      }}
    >
      <Image
        style={{
          width: "75%",
          resizeMode: "contain",
          height: undefined,
          aspectRatio: 1,
        }}
        source={require("../assets/text_transp.png")}
      />
    </View>
  );
}
export default function MapStack() {
  return (
    <Stack.Navigator initialRouteName="Your Projects">
      <Stack.Screen
        name="Your Projects"
        HeaderComponent
        options={{
          headerTintColor: "white",
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: "#94D6B3",
            borderBottomColor: "#45B37A",
            borderBottomWidth: 5,
          },
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      >
        {(props) => <FollowingList {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="View Project"
        options={{
          headerTintColor: "white",
          headerStyle: { backgroundColor: "green" },
          headerShown: false,
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      >
        {(props) => <Project {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Project Discussion"
        options={{
          headerTintColor: "white",
          headerStyle: { backgroundColor: "green" },
          headerShown: true,
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      >
        {(props) => <Discussion {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
