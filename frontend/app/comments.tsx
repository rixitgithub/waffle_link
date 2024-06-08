import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface Comment {
  id: string;
  text: string;
  userId: string;
  // Add more properties as needed
}

interface CommentsScreenProps {
  postId: string;
  onClose: () => void;
}

const CommentsScreen: React.FC<CommentsScreenProps> = ({ postId, onClose }) => {
  // Logic to fetch comments based on postId
  const comments: Comment[] = [];

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
});

export default CommentsScreen;
