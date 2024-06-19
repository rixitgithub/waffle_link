import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { Post } from "./HomeScreen"; // Import Post type if needed
import { upvotePost } from "../api/post"; // Ensure this import matches the export in api.js

interface PostComponentProps {
  item: Post;
}

const PostComponent: React.FC<PostComponentProps> = ({ item }) => {
  const navigation = useNavigation(); // Initialize navigation
  const [upvoted, setUpvoted] = useState(false); // Initially false as example
  const [upvotes, setUpvotes] = useState(item.upvotes?.length ?? 0);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setUpvotes(item.upvotes?.length ?? 0);
    // Assuming logic for checking if current user has upvoted
    // Replace this with your actual logic to check if user has upvoted
    setUpvoted(item.upvotes?.includes("currentUserId")); // Replace "currentUserId" with actual user ID logic
  }, [item.upvotes]);

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

    // Simulate toggling of upvote state
    setUpvoted((prevUpvoted) => !prevUpvoted);
    setUpvotes((prevUpvotes) =>
      prevUpvoted ? prevUpvotes - 1 : prevUpvotes + 1
    );

    // Call the upvote function from the API file
    try {
      await upvotePost(item._id);
    } catch (error) {
      console.error(error);
      // Revert upvotes count on error
      setUpvoted((prevUpvoted) => !prevUpvoted);
      setUpvotes((prevUpvotes) =>
        prevUpvoted ? prevUpvotes + 1 : prevUpvotes - 1
      );
    }
  };

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const openComments = (postId: string) => {
    navigation.navigate("comments", { postId: item._id });
  };

  return (
    <View style={styles.postContainer}>
      {/* Post UI */}
      <View style={styles.postContent}>
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: item.userImage }} style={styles.userImage} />
          <Text style={styles.userName}>{item.userName}</Text>
        </View>
        <Text style={styles.postText}>{item.postText}</Text>
        {/* Ensure item.postImages is defined and an array before mapping */}
        {item.postImages && Array.isArray(item.postImages) && (
          <Swiper style={styles.swiper}>
            {item.postImages.map((image, index) => (
              <View key={index}>
                <Image source={{ uri: image }} style={styles.postImage} />
              </View>
            ))}
          </Swiper>
        )}
      </View>
      {/* Interaction buttons */}
      <View style={styles.interactionButtons}>
        <Pressable onPress={handleUpvote} style={styles.button}>
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }, { rotate: rotateInterpolate }],
              opacity: fadeValue,
            }}
          >
            <FontAwesome name="thumbs-up" size={20} />
          </Animated.View>
          <Text style={styles.buttonText}>{upvotes}</Text>
        </Pressable>
        <Pressable onPress={() => openComments(item._id)} style={styles.button}>
          <FontAwesome name="comment" size={20} />
          <Text style={styles.buttonText}>{item.comments}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  postContent: {
    marginBottom: 10,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postText: {
    fontSize: 14,
    marginBottom: 10,
  },
  swiper: {
    height: 200,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  interactionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 5,
  },
});

export default PostComponent;
