import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Provider, useSelector } from "react-redux";
import TabNavigator from "./navigation/TabNavigator";

export default function App() {
  return <TabNavigator />;
}
