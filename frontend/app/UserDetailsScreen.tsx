import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import UserPost from "./UserPost"; // Import the UserPost component

// Function to fetch user details based on userId
const fetchUserDetails = async (id) => {
  // Replace this with your actual API call or data fetching logic
  // This function should return user details including posts
  // For simplicity, we'll return a mock data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userDetails = {
        id: id,
        name: "John Doe",
        email: "john.doe@example.com",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        profileImage: "https://via.placeholder.com/150",
        posts: [
          {
            id: "1",
            userImage: "https://via.placeholder.com/40",
            userName: "User One",
            postText: "Loving this view!",
            postImages: [
              "https://via.placeholder.com/700x400",
              "https://via.placeholder.com/600x400",
              "https://via.placeholder.com/600x400",
            ],
            views: 120,
            likes: 30,
            comments: 10,
          },
          {
            id: "2",
            userImage: "https://via.placeholder.com/40",
            userName: "User Two",
            postText: "Amazing sunset today.",
            postImages: ["https://via.placeholder.com/600x400"],
            views: 80,
            likes: 25,
            comments: 5,
          },
        ],
      };
      resolve(userDetails);
    }, 1000);
  });
};

const UserDetailsScreen = () => {
  const route = useRoute();
  const userId = route.params ? route.params.id : null;
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const data = await fetchUserDetails(userId);
        setUserDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };

    getUserDetails();
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        userDetails && (
          <>
            {/* User information */}
            <View style={styles.userInfoContainer}>
              <Image
                source={{ uri: userDetails.profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userId}</Text>
                <Text style={styles.userEmail}>{userDetails.email}</Text>
                <Text style={styles.userBio}>{userDetails.bio}</Text>
                {/* Display number of posts */}
                <Text style={styles.userInfoText}>
                  Posts: {userDetails.posts.length}
                </Text>
                {/* Display number of followers (you can replace the value with actual follower count) */}
                <Text style={styles.userInfoText}>Followers: 1000</Text>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Follow</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.messageButton]}>
                <Text style={[styles.buttonText, styles.messageButtonText]}>
                  Message
                </Text>
              </TouchableOpacity>
            </View>
            {/* User's posts */}
            {userDetails.posts.map((post) => (
              <UserPost key={post.id} post={post} />
            ))}
          </>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  userInfoContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    color: "#666",
    marginBottom: 5,
  },

  userBio: {
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  messageButton: {
    backgroundColor: "#28a745",
  },
  messageButtonText: {
    color: "#fff",
  },
});

export default UserDetailsScreen;
