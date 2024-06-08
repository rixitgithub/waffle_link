import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect hook

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { fetchUserProfile } from "../../api/user.js";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [username, setUsername] = useState(null);

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
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      fetchProfileData();

      // Return cleanup function to cancel any pending requests or subscriptions
      return () => {
        // Cleanup logic here (if needed)
      };
    }, [])
  );

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
