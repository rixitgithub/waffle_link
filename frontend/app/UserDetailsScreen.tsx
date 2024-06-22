import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { fetchNGOById } from "../api/ngo"; // Adjust the path as needed
import { FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { upvotePost } from "../api/post"; // Ensure this import matches the export in api.js
import CampaignComponent from "./CampaignComponent"; // Import your CampaignComponent

const UserDetailsScreen = () => {
  const route = useRoute();
  const ngoId = route.params ? route.params.id : null; // Assuming ngoId is passed as a route parameter
  const [ngoDetails, setNGODetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPosts, setShowPosts] = useState(true); // State to toggle between posts and campaigns

  useEffect(() => {
    const getNGODetails = async () => {
      try {
        const details = await fetchNGOById(ngoId);
        setNGODetails(details);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NGO details:", error);
        setLoading(false);
      }
    };

    if (ngoId) {
      getNGODetails();
    }
  }, [ngoId]);

  const navigation = useNavigation(); // Initialize navigation
  const [upvoted, setUpvoted] = useState(false); // Initialize state for upvoted
  const [upvotes, setUpvotes] = useState(0); // Initialize state for upvotes
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setUpvotes(0); // Reset upvotes count
    setUpvoted(false); // Reset upvoted state
  }, [ngoDetails]);

  const handleUpvote = async () => {
    // Animate the thumbs-up icon
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    if (upvoted) {
      setUpvoted(false);
      setUpvotes((prevUpvotes) => prevUpvotes - 1);
    } else {
      setUpvoted(true);
      setUpvotes((prevUpvotes) => prevUpvotes + 1);
    }

    // Simulate upvote API call
    // Replace with actual API call using upvotePost function
    // try {
    //   await upvotePost(item._id);
    // } catch (error) {
    //   console.error(error);
    //   setUpvoted((prevUpvoted) => !prevUpvoted);
    //   setUpvotes((prevUpvotes) =>
    //     upvoted ? prevUpvotes + 1 : prevUpvotes - 1
    //   ); // Revert upvotes count on error
    // }
  };

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const openComments = () => {
    navigation.navigate("comments", {
      postId: ngoDetails.posts[0]._id, // Replace with actual postId
    });
  };

  const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInMilliseconds = now - createdDate;

    // Convert milliseconds to seconds
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    // Handle different time intervals
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  const renderPost = (item) => (
    <View style={[styles.postContainer, { backgroundColor: "#fff" }]}>
      <View style={styles.userContainer}>
        <Pressable onPress={() => {}}>
          <Image
            source={{ uri: ngoDetails.profilePhoto }}
            style={styles.userImage}
          />
        </Pressable>

        <View style={styles.userInfo}>
          <Pressable onPress={() => {}}>
            <Text style={[styles.userName, { color: "#000" }]}>
              {ngoDetails.name}
            </Text>
          </Pressable>
          <Text style={[styles.userCategory, { color: "#333" }]}>
            {ngoDetails.category}
          </Text>
        </View>
        <View>
          <Text style={[styles.timeAgo, { color: "#333" }]}>
            {formatTimeAgo(item.createdAt)}
          </Text>
        </View>
      </View>
      <Text style={[styles.postText, { color: "#000" }]}>{item.title}</Text>
      <Text style={[styles.postText, { color: "#000" }]}>{item.content}</Text>
      {item.images && item.images.length > 0 ? (
        <Swiper style={styles.swiper}>
          {item.images.map((image, index) => (
            <View key={index}>
              <Pressable onPress={() => {}}>
                <Image source={{ uri: image }} style={styles.postImage} />
              </Pressable>
            </View>
          ))}
        </Swiper>
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No images available</Text>
        </View>
      )}
      <View style={styles.postStats}>
        <View style={styles.statsLeft}>
          <Pressable onPress={handleUpvote} style={styles.upvoteButton}>
            <Animated.View
              style={{
                transform: [
                  { scale: scaleValue },
                  { rotate: rotateInterpolate },
                ],
                opacity: fadeValue,
              }}
            >
              <FontAwesome name="thumbs-up" size={20} style={styles.statIcon} />
            </Animated.View>
          </Pressable>
          <Text style={[styles.statText, { color: "#333" }]}>
            {upvotes} Upvotes
          </Text>
          <Pressable onPress={openComments} style={styles.commentButton}>
            <FontAwesome name="comment" size={20} style={styles.statIcon} />
            <Text style={[styles.statText, { color: "#333" }]}>5 Comments</Text>
          </Pressable>
        </View>
        <FontAwesome name="share" size={20} style={styles.shareIcon} />
      </View>
    </View>
  );

  const renderCampaign = (item) => (
    <CampaignComponent
      item={item}
      colors={{
        card: "#f0f0f0",
        text: "#000",
        primary: "#007bff",
        inactive: "#333",
      }}
      onVolunteer={() =>
        console.log("Volunteer action triggered for campaign ID:", item._id)
      }
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        ngoDetails && (
          <>
            {/* NGO information */}
            <View style={styles.ngoInfoContainer}>
              <Image
                source={{ uri: ngoDetails.profilePhoto }}
                style={styles.profileImage}
              />
              <View style={styles.ngoInfo}>
                <Text style={styles.ngoName}>{ngoDetails.name}</Text>
                <Text style={styles.ngoCategory}>
                  Category: {ngoDetails.category}
                </Text>
                <Text style={styles.ngoMission}>
                  Mission: {ngoDetails.missionStatement}
                </Text>
                <Text style={styles.ngoContact}>
                  Contact: {ngoDetails.contactEmail}
                </Text>
                <Text style={styles.ngoWebsite}>
                  Website: {ngoDetails.website}
                </Text>
              </View>
            </View>

            {/* Toggle between Posts and Campaigns */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  showPosts ? styles.activeToggle : null,
                ]}
                onPress={() => setShowPosts(true)}
              >
                <Text style={styles.toggleText}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !showPosts ? styles.activeToggle : null,
                ]}
                onPress={() => setShowPosts(false)}
              >
                <Text style={styles.toggleText}>Campaigns</Text>
              </TouchableOpacity>
            </View>

            {/* Posts or Campaigns */}
            {showPosts ? (
              <FlatList
                data={ngoDetails.posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderPost(item)}
              />
            ) : (
              <FlatList
                data={ngoDetails.campaigns}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderCampaign(item)}
              />
            )}
          </>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  ngoInfoContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  ngoInfo: {
    flex: 1,
  },
  ngoName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ngoCategory: {
    fontSize: 16,
    marginBottom: 4,
  },
  ngoMission: {
    fontSize: 16,
    marginBottom: 4,
  },
  ngoContact: {
    fontSize: 16,
    marginBottom: 4,
  },
  ngoWebsite: {
    fontSize: 16,
    marginBottom: 4,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#007bff",
  },
  activeToggle: {
    backgroundColor: "#0056b3",
  },
  toggleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userCategory: {
    fontSize: 14,
  },
  timeAgo: {
    fontSize: 12,
  },
  postText: {
    fontSize: 16,
    marginBottom: 12,
  },
  swiper: {
    height: 200,
    marginBottom: 12,
  },
  postImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  noImageContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 12,
  },
  noImageText: {
    fontSize: 16,
    color: "#333",
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  statsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  upvoteButton: {
    marginRight: 12,
  },
  statIcon: {
    marginRight: 4,
  },
  statText: {
    fontSize: 14,
    marginRight: 12,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareIcon: {
    color: "#007bff",
  },
});

export default UserDetailsScreen;
