import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useRoute } from "@react-navigation/native";

// Function to fetch comments based on postId
const fetchComments = async (postId) => {
  // Replace this with your actual API call or data fetching logic
  // This function should return comments for the given postId
  // For simplicity, we'll return a mock data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const comments = [
        { id: "1", userName: "User1", comment: "Nice post!" },
        { id: "2", userName: "User2", comment: "Great view!" },
        { id: "3", userName: "User3", comment: "Amazing!" },
      ];
      resolve(comments);
    }, 1000);
  });
};

const comments = ({}) => {
  const route = useRoute();
  const postId = route.params ? route.params.postId : null;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await fetchComments(postId);
        setComments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setLoading(false);
      }
    };

    getComments();
  }, [postId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          {/* Header */}
          <Text style={styles.title}>Comments for Post ID: {postId}</Text>
          {/* List of comments */}
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                <Image
                  source={{ uri: "https://via.placeholder.com/40" }}
                  style={styles.userImage}
                />
                <View style={styles.commentTextContainer}>
                  <Text style={styles.commentUser}>{comment.userName}</Text>
                  <Text style={styles.commentText}>{comment.comment}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noCommentsText}>No comments available</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
  },
  noCommentsText: {
    alignSelf: "center",
    marginTop: 20,
  },
});

export default comments;
