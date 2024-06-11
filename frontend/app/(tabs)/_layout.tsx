import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { fetchUserProfile } from "../../api/user.js";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [username, setUsername] = useState(null);
  const [isOwner, setIsOwner] = useState(false); // State for ownership status

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfileData = async () => {
        try {
          const userProfile = await fetchUserProfile();
          console.log(userProfile);
          if (userProfile) {
            setUsername(userProfile.username);
            if (userProfile.profilePicture) {
              console.log("profile photo", userProfile.profilePicture);
              setProfilePhoto(userProfile.profilePicture);
            }
            setIsOwner(userProfile.isOwner); // Set ownership status
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      fetchProfileData();

      return () => {
        // Cleanup logic here (if needed)
      };
    }, [])
  );

  if (isOwner) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="ownerHome"
          options={{
            title: "Owner Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ownerSettings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "settings" : "settings-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ownerProfile"
          options={{
            title: username || "Profile",
            tabBarIcon: ({ color, focused }) =>
              profilePhoto ? (
                <Image
                  key={profilePhoto}
                  source={{ uri: profilePhoto }}
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                />
              ) : (
                <TabBarIcon
                  name={focused ? "person" : "person-outline"}
                  color={color}
                />
              ),
          }}
        />
      </Tabs>
    );
  } else {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "people" : "people-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: username || "Profile",
            tabBarIcon: ({ color, focused }) =>
              profilePhoto ? (
                <Image
                  key={profilePhoto}
                  source={{ uri: profilePhoto }}
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                />
              ) : (
                <TabBarIcon
                  name={focused ? "person" : "person-outline"}
                  color={color}
                />
              ),
          }}
        />
      </Tabs>
    );
  }
}
