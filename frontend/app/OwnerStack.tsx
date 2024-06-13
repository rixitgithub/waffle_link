import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import YourNgo from "./yourngo";
import CreateOptions from "./createoptions";
import Volunteers from "./volunteers";
import { useColorScheme } from "@/hooks/useColorScheme";

const Tab = createBottomTabNavigator();

const OwnerTabs = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "YourNgo") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "CreateOptions") {
            iconName = focused ? "create" : "create-outline";
          } else if (route.name === "Volunteers") {
            iconName = focused ? "people" : "people-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="YourNgo"
        component={YourNgo}
        options={{ title: "Your NGO" }}
      />
      <Tab.Screen
        name="CreateOptions"
        component={CreateOptions}
        options={{ title: "Create" }}
      />
      <Tab.Screen
        name="Volunteers"
        component={Volunteers}
        options={{ title: "Volunteers" }}
      />
    </Tab.Navigator>
  );
};

export default OwnerTabs;
