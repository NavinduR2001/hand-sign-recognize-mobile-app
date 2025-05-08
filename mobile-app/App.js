import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddMemberScreen from "./components/AddMemberScreen";
import ContactListScreen from "./components/ContactListScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddMember" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AddMember" component={AddMemberScreen} />
        <Stack.Screen name="ContactList" component={ContactListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
