import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library

export default function Volunteers() {
  const navigation = useNavigation();

  const [volunteers, setVolunteers] = useState([
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Alice Johnson" },
    { id: "4", name: "Bob Brown" },
  ]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate("VolunteerRequests")}
      >
        <Icon name="envelope" size={24} color="#000" />
      </TouchableOpacity>
      <FlatList
        data={volunteers}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.volunteerItem}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  volunteerItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  iconButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
});
