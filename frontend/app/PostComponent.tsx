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
import { upvotePost } from "../api/post"; // Ensure this import matches the export in api.js

interface Post {
  _id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
  ngoId: {
    _id: string;
    name: string;
    profilePhoto: string;
    category: string;
  };
  upvotes: string[]; // Array of user IDs
  comments: string[]; // Array of comment IDs
}

interface PostComponentProps {
  item: Post;
  colors: any; // Adjust type as per your Colors definition
  openImageModal: (imageUrl: string) => void;
  openUserDetails: (userId: string) => void;
  userId: string; // Assuming you have a way to pass the user's ID
}

const PostComponent: React.FC<PostComponentProps> = ({
  item,
  colors,
  openImageModal,
  openUserDetails,
  userId,
}) => {
  console.log("trial", item);
  const navigation = useNavigation(); // Initialize navigation
  const [upvoted, setUpvoted] = useState(item.upvotes.includes(userId));
  const [upvotes, setUpvotes] = useState(item.upvotes?.length ?? 0);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setUpvotes(item.upvotes?.length ?? 0);
    setUpvoted(item.upvotes.includes(userId));
  }, [item.upvotes, userId]);

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

    // Call the upvote function from the API file
    try {
      await upvotePost(item._id);
    } catch (error) {
      console.error(error);
      setUpvoted((prevUpvoted) => !prevUpvoted);
      setUpvotes((prevUpvotes) =>
        upvoted ? prevUpvotes + 1 : prevUpvotes - 1
      ); // Revert upvotes count on error
    }
  };

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const openComments = () => {
    navigation.navigate("comments", {
      postId: item._id,
    });
  };

  const formatTimeAgo = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `${interval} months ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return `${interval} days ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval} minutes ago`;
    }
    return `${Math.floor(seconds)} seconds ago`;
  };

  return (
    <View style={[styles.postContainer, { backgroundColor: colors.card }]}>
      <View style={styles.userContainer}>
        <Pressable onPress={() => openUserDetails(item.ngoId?._id)}>
          <Image
            source={{ uri: item.ngoId?.profilePhoto }}
            style={styles.userImage}
          />
        </Pressable>

        <View style={styles.userInfo}>
          <Pressable onPress={() => openUserDetails(item.ngoId._id)}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {item.ngoId?.name}
            </Text>
          </Pressable>
          <Text style={[styles.userCategory, { color: colors.inactive }]}>
            {item.ngoId?.category}
          </Text>
        </View>
        <View>
          <Text style={[styles.timeAgo, { color: colors.inactive }]}>
            {formatTimeAgo(item.createdAt)}
            {/* Format as needed */}
          </Text>
        </View>
      </View>
      <Text style={[styles.postText, { color: colors.text }]}>
        {item.title}
      </Text>
      <Text style={[styles.postText, { color: colors.text }]}>
        {item.content}
      </Text>
      {item.images && item.images.length > 0 ? (
        <Swiper style={styles.swiper}>
          {item.images.map((image, index) => (
            <View key={index}>
              <Pressable onPress={() => openImageModal(image)}>
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
              <FontAwesome
                name="thumbs-up"
                size={20}
                style={[
                  styles.statIcon,
                  upvoted
                    ? { color: colors.primary }
                    : { color: colors.inactive },
                ]}
              />
            </Animated.View>
          </Pressable>
          <Text style={[styles.statText, { color: colors.inactive }]}>
            {upvotes} {/* Display the dynamic upvotes count */}
          </Text>
          <Pressable onPress={openComments} style={styles.commentButton}>
            <FontAwesome
              name="comment"
              size={20}
              style={[styles.statIcon, { color: colors.inactive }]}
            />
            <Text style={[styles.statText, { color: colors.inactive }]}>
              {item.comments?.length ?? 0}{" "}
              {/* Display the dynamic comments count */}
            </Text>
          </Pressable>
        </View>
        <FontAwesome
          name="share"
          size={20}
          style={[styles.shareIcon, { color: colors.inactive }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
  },
  userContainer: {
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
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userCategory: {
    fontSize: 12,
  },
  timeAgo: {
    fontSize: 12,
    color: "gray",
  },
  postText: {
    fontSize: 14,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  noImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  noImageText: {
    fontSize: 16,
    color: "gray",
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  statsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  upvoteButton: {
    marginRight: 5,
  },
  statIcon: {
    marginRight: 5,
  },
  statText: {
    marginRight: 15,
    fontSize: 14,
    color: "gray",
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareIcon: {},
  swiper: {
    height: 200,
  },
});

export default PostComponent;
