import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const UserPost = ({ post }) => {
  return (
    <View style={[styles.postContainer, { backgroundColor: "#f8f9fa" }]}>
      {/* User information */}
      <View style={styles.userContainer}>
        <Image source={{ uri: post.userImage }} style={styles.userImage} />
        <Text style={styles.userName}>{post.userName}</Text>
      </View>
      {/* Post content */}
      <Text style={styles.postText}>{post.postText}</Text>
      {/* Post images */}
      <View style={styles.postImages}>
        {post.postImages.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.postImage} />
        ))}
      </View>
      {/* Post statistics */}
      <View style={styles.postStats}>
        <TouchableOpacity style={styles.statButton}>
          <FontAwesome name="heart" size={20} style={styles.statIcon} />
          <Text style={styles.statText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statButton}>
          <FontAwesome name="comment" size={20} style={styles.statIcon} />
          <Text style={styles.statText}>{post.comments}</Text>
        </TouchableOpacity>
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
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postText: {
    marginBottom: 10,
  },
  postImages: {
    flexDirection: "row",
    marginBottom: 10,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  postStats: {
    flexDirection: "row",
  },
  statButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  statIcon: {
    marginRight: 5,
  },
  statText: {
    fontSize: 16,
  },
});

export default UserPost;
