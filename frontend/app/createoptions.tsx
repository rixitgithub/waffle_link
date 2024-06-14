import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import PostModal from "./PostModal"; // Import PostModal component

const CreateOptions: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

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
