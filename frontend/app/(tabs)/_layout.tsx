import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Image, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { fetchUserProfile } from "../../api/user.js";
import OwnerStack from "../OwnerStack"; // Import OwnerStack

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfileData = async () => {
        try {
          const userProfile = await fetchUserProfile();
          console.log(userProfile);
          if (userProfile) {
            setUsername(userProfile.username);
            if (
              userProfile.profilePicture &&
              typeof userProfile.profilePicture === "string"
            ) {
              console.log("profile photo", userProfile.profilePicture);
              setProfilePhoto(userProfile.profilePicture);
            }
            setIsOwner(userProfile.isNgoOwner);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      fetchProfileData();

      return () => {
        console.log(isOwner);
        // Cleanup logic here (if needed)
      };
    }, [])
  );

  if (isOwner) {
    return <OwnerStack />;
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
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
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
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={24}
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

const styles = StyleSheet.create({
  profileIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
