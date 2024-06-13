// CreateOptions.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import PostModal from "./PostModal"; // Import PostModal component
import { createPost } from "../api/post"; // Import createPost function from api.ts

const CreateOptions: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmitPost = async (postData: {
    title: string;
    images: string[];
    content: string;
  }) => {
    try {
      const success = await createPost(postData);

      if (success) {
        Alert.alert("Success", "Post created successfully");
        setModalVisible(false); // Close the modal after successful submission
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.option}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.optionText}>Create Post</Text>
      </TouchableOpacity>

      {/* PostModal component */}
      <PostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitPost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  option: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
  },
});

export default CreateOptions;
