import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function VolunteerRequests() {
  // Dummy data for volunteer requests
  const [requests, setRequests] = useState([
    {
      id: "1",
      name: "Michael Scott",
      request: "Looking to volunteer for marketing.",
    },
    {
      id: "2",
      name: "Pam Beesly",
      request: "Interested in art and design volunteering.",
    },
    {
      id: "3",
      name: "Jim Halpert",
      request: "Wants to volunteer for event planning.",
    },
    {
      id: "4",
      name: "Dwight Schrute",
      request: "Available for security and organizational work.",
    },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestName}>{item.name}</Text>
            <Text style={styles.requestText}>{item.request}</Text>
          </View>
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
  requestItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  requestName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  requestText: {
    marginTop: 8,
    fontSize: 14,
  },
});
