import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function CreateOptions() {
  // Add more functions and options as needed

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Create Post</Text>
      </TouchableOpacity>
      {/* Add more TouchableOpacity components for other options */}
    </View>
  );
}

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
