import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getVolunteerRecruited } from "../api/campaign"; // Adjust the import path as needed

export default function Volunteers() {
  const navigation = useNavigation();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const data = await getVolunteerRecruited();
        setNgos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching volunteer recruited", error);
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const renderVolunteerItem = ({ item }) => (
    <View style={styles.ngoContainer}>
      <Text style={styles.ngoName}>{item.title}</Text>
      <Text style={styles.ngoDescription}>{item.description}</Text>
      <View style={styles.volunteerList}>
        <Text style={styles.sectionHeader}>Volunteers Recruited:</Text>
        {item.progress.volunteer.volunteer_recruited.map((volunteer) => (
          <View style={styles.volunteerItem} key={volunteer._id}>
            <Text style={styles.volunteerName}>{volunteer.name}</Text>
            <Text style={styles.volunteerEmail}>{volunteer.email}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate("VolunteerRequests")}
      >
        <Icon name="envelope" size={24} color="#000" />
      </TouchableOpacity>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={ngos}
          renderItem={renderVolunteerItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  ngoContainer: {
    marginTop: 60,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
  },
  ngoName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  ngoDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  volunteerList: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  volunteerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  volunteerEmail: {
    fontSize: 14,
    color: "#666",
  },
  iconButton: {
    position: "absolute",
    top: 35,
    left: 16,
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
