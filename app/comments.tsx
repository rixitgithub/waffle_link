import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

interface Comment {
  id: string;
  userImage: string;
  userName: string;
  text: string;
}

const dummyComments: Comment[] = [
  {
    id: "1",
    userImage: "https://via.placeholder.com/40",
    userName: "Commenter One",
    text: "Nice post!",
  },
  {
    id: "2",
    userImage: "https://via.placeholder.com/40",
    userName: "Commenter Two",
    text: "I agree with you!",
  },
];

const CommentsScreen: React.FC = () => {
  const route = useRoute();
  const { postId } = route.params as { postId: string };
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [newComment, setNewComment] = useState<string>("");

  const handleSend = () => {
    if (newComment.trim().length === 0) return;
    const newCommentData = {
      id: Math.random().toString(),
      userImage: "https://via.placeholder.com/40",
      userName: "New Commenter",
      text: newComment,
    };
    setComments([...comments, newCommentData]);
    setNewComment("");
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.userImage }} style={styles.commentUserImage} />
      <View style={styles.commentTextContainer}>
        <Text style={styles.commentUserName}>{item.userName}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.commentsScreenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.commentsList}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <FontAwesome name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  commentsScreenContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  commentsList: {
    padding: 10,
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  commentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  commentUserName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    color: "gray",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "blue",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommentsScreen;
