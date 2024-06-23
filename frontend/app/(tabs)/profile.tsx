import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { fetchUserProfile } from "../../api/user.js"; // Assuming this function fetches user profile data
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchUserProfile(); // Assuming this function fetches user profile data
        setLoading(false);
        setUserData(userData);
        if (userData != null) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        if (error.response && error.response.status === 401) {
          await AsyncStorage.removeItem("token");
          navigation.navigate("Login");
        }
      }
    };

    fetchUserData();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const userData = await fetchUserProfile();
      setUserData(userData);
      if (userData != null) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (authenticated) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image
          source={{ uri: userData?.profilePicture || "" }}
          style={styles.profilePicture}
        />

        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{userData?.username || "Unknown"}</Text>
          <Text style={styles.userEmail}>{userData?.email || "Unknown"}</Text>
          <Text style={styles.userBio}>
            {userData?.bio || "No bio available"}
          </Text>
        </View>

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

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rewardsButton}
          onPress={() => navigation.navigate("RewardSection")}
        >
          <Text style={styles.rewardsButtonText}>My Rewards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rewardsButton}
          onPress={() => navigation.navigate("LeaderBoard")}
        >
          <Text style={styles.rewardsButtonText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <FontAwesome name="sign-out" size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => navigation.navigate("CreateAccount")}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  rewardsButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  rewardsButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
