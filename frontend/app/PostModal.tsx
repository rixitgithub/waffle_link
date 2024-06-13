// PostModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (postData: {
    title: string;
    images: string[];
    content: string;
  }) => void;
};

const PostModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [content, setContent] = useState("");

  const handleImageUpload = () => {
    // Handle image upload logic if needed
  };

  const handleSubmit = () => {
    // Validate input fields if necessary
    onSubmit({ title, images, content });
    // Reset state and close modal
    setTitle("");
    setImages([]);
    setContent("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={title}
            onChangeText={setTitle}
          />
          {/* Add image upload functionality */}
          <TextInput
            style={styles.input}
            placeholder="Enter post content"
            multiline
            numberOfLines={4}
            value={content}
            onChangeText={setContent}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minHeight: 40,
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PostModal;
