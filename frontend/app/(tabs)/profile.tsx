import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true); // State to track loading status

  // Function to fetch user data
  const fetchUserData = async () => {
    // Replace this with actual API call to fetch user data
    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        const mockUserData = {
          name: "John Doe",
          email: "johndoe@example.com",
          bio: "Passionate about making a positive impact in the world.",
          profilePicture: "https://via.placeholder.com/150",
          activitySummary: {
            posts: 10,
            connections: 50,
            followers: 100,
          },
          // Add more user data fields as needed
        };
        setUserData(mockUserData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Render loading indicator if data is still loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render user profile once data is fetched
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture */}
      <Image
        source={{ uri: userData.profilePicture }}
        style={styles.profilePicture}
      />

      {/* User Information */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.userBio}>{userData.bio}</Text>
      </View>

      {/* Activity Summary */}
      <View style={styles.activitySummaryContainer}>
        <Text>Posts: {userData.activitySummary.posts}</Text>
        <Text>Connections: {userData.activitySummary.connections}</Text>
        <Text>Followers: {userData.activitySummary.followers}</Text>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Rewards Section */}
      <View style={styles.rewardsSection}>
        <Text style={styles.sectionTitle}>Rewards</Text>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardName}>Reward 1</Text>
          <Text style={styles.rewardDescription}>Description of Reward 1</Text>
        </View>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardName}>Reward 2</Text>
          <Text style={styles.rewardDescription}>Description of Reward 2</Text>
        </View>
        {/* Add more reward items as needed */}
      </View>

      {/* Create Account Button */}
      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={() => navigation.navigate("CreateAccount")}
      >
        <FontAwesome name="user-plus" size={24} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 50,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  userInfoContainer: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  userBio: {
    textAlign: "center",
    marginBottom: 20,
  },
  activitySummaryContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  rewardsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rewardItem: {
    marginBottom: 10,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rewardDescription: {
    fontSize: 14,
    color: "#666",
  },
  createAccountButton: {
    position: "absolute",
    top: 30,
    right: 10,
  },
});

export default ProfileScreen;
