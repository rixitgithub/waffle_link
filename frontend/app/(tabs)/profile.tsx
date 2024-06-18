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
import { fetchUserProfile } from "../../api/user.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RewardsSection from "../RewardSection";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchUserProfile(); // Call the fetchUserDetails function
        console.log("checking", userData);
        setLoading(false);
        setUserData(userData);
        if (userData != null) {
          setAuthenticated(true); // Set authenticated to true if user data is fetched successfully
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        // Check if the error is due to JWT expiration
        if (error.response && error.response.status === 401) {
          // Remove the token from AsyncStorage
          await AsyncStorage.removeItem("token");
          // Redirect to the login screen or perform any other action
          navigation.navigate("Login");
        }
      }
    };

    fetchUserData();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      // Remove the token from AsyncStorage
      await AsyncStorage.removeItem("token");
      // Redirect to the login screen
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Render loading indicator if data is still loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render user profile once data is fetched and user is authenticated
  if (authenticated) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Picture */}
        <Image
          source={{ uri: userData?.profilePicture || "jiojio" }}
          style={styles.profilePicture}
        />

        {/* User Information */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{userData?.username || "Unknown"}</Text>
          <Text style={styles.userEmail}>{userData?.email || "Unknown"}</Text>
          <Text style={styles.userBio}>
            {userData?.bio || "No bio available"}
          </Text>
        </View>

        {/* Activity Summary */}
        <View style={styles.activitySummaryContainer}>
          <Text style={styles.activitySummaryTitle}>Activity Summary</Text>
          <View style={styles.activitySummaryItem}>
            <FontAwesome name="file-text-o" size={20} color="#007bff" />
            <Text style={styles.activitySummaryText}>
              Posts: {userData?.activitySummary?.posts || 0}
            </Text>
          </View>
          <View style={styles.activitySummaryItem}>
            <FontAwesome name="users" size={20} color="#007bff" />
            <Text style={styles.activitySummaryText}>
              Connections: {userData?.activitySummary?.connections || 0}
            </Text>
          </View>
          <View style={styles.activitySummaryItem}>
            <FontAwesome name="heart" size={20} color="#007bff" />
            <Text style={styles.activitySummaryText}>
              Followers: {userData?.activitySummary?.followers || 0}
            </Text>
          </View>
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
          {/* Render reward items here */}
          <RewardsSection />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <FontAwesome name="sign-out" size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>
    );
  } else {
    // Render create account button if user is not authenticated
    return (
      <View style={styles.container}>
        {/* Create Account Button */}
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate("CreateAccount")}
        >
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
        <RewardsSection />
        {/* Create NGO Button */}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 70,
    paddingHorizontal: 30,
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
    alignItems: "center",
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
    alignItems: "center",
  },
  activitySummaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  activitySummaryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  activitySummaryText: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  logoutButton: {
    position: "absolute",
    top: 30,
    left: 10,
  },
  createAccountButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },

  createAccountButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  createNgoButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },

  createNgoButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
