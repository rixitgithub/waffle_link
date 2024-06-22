import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { fetchComments, postComment } from "../api/comment"; // Import the fetchComments and postComment functions

const Comments = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route.params ? route.params.postId : null;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [refreshComments, setRefreshComments] = useState(false); // State variable to trigger comment refresh

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await fetchComments(postId); // Call fetchComments with postId
        // Reverse the order of comments to show latest on top
        setComments(data.reverse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setLoading(false);
      }
    };

    if (postId) {
      getComments();
    }
  }, [postId, refreshComments]); // Include refreshComments in dependencies

  const handlePostComment = useCallback(async () => {
    if (!commentText.trim()) {
      return;
    }

    try {
      await postComment(postId, commentText); // Replace with your API call to post a comment
      setCommentText(""); // Clear the comment text input
      setRefreshComments((prev) => !prev); // Toggle refreshComments to trigger refresh
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }, [postId, commentText]);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View>
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <View key={comment._id} style={styles.commentContainer}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/40" }}
                    style={styles.userImage}
                  />
                  <View style={styles.commentTextContainer}>
                    <Text style={styles.commentUser}>
                      {comment.userId.username}
                    </Text>
                    <Text style={styles.commentText}>{comment.comment}</Text>
                    <Text style={styles.commentDateTime}>
                      {formatDateTime(comment.createdAt)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noCommentsText}>No comments available</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Text input and send button at the bottom */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your comment..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <Button title="Send" onPress={handlePostComment} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  commentDateTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  noCommentsText: {
    alignSelf: "center",
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#fff",
  },
});

export default Comments;
