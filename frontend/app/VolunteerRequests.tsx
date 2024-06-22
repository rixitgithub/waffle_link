import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  getVolunteerRequest,
  sendVolunteerRequestAction,
} from "../api/campaign"; // Adjust the import path as needed

export default function VolunteerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getVolunteerRequest();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching volunteer requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (campaignId, userId, actionType) => {
    try {
      await sendVolunteerRequestAction(campaignId, userId, actionType);
      // Update the state to remove the processed request
      setRequests((prevRequests) => {
        return prevRequests.map((item) => {
          if (item.campaign._id === campaignId) {
            return {
              ...item,
              requests: item.requests.filter(
                (request) => request.user._id !== userId
              ),
            };
          }
          return item;
        });
      });
    } catch (error) {
      console.error(`Error ${actionType}ing volunteer request`, error);
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.campaignTitle}>{item.campaign.title}</Text>
      <Text style={styles.ngoName}>{item.campaign.ngo.name}</Text>
      {item.requests.map((request, index) => (
        <View key={index} style={styles.userRequest}>
          <Text style={styles.requestName}>{request.user.name}</Text>
          <Text style={styles.requestText}>{request.text}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() =>
                handleAction(item.campaign._id, request.user._id, "accept")
              }
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() =>
                handleAction(item.campaign._id, request.user._id, "reject")
              }
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.campaign._id}
        />
      )}
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
  campaignTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  ngoName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  userRequest: {
    marginBottom: 12,
  },
  requestName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  requestText: {
    fontSize: 14,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  acceptButton: {
    backgroundColor: "#32CD32", // Green color for accept button
  },
  rejectButton: {
    backgroundColor: "#FF6347", // Red color for reject button
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
