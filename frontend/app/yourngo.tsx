import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchNGODetails } from "../api/ngo"; // Adjust the path as needed
import MyPosts from "./MyPosts"; // Import MyPosts component
import MyCampaigns from "./MyCampaigns"; // Import Campaigns component

type NGO = {
  profilePhoto: string;
  name: string;
  missionStatement: string;
  contactInfo: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  founders: {
    image: string;
    name: string;
    position: string;
  }[];
  posts: {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
  }[];
  campaigns: {
    id: string;
    title: string;
    description: string;
  }[];
};

export default function YourNGO() {
  const navigation = useNavigation();
  const [ngo, setNGO] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"posts" | "campaigns">("posts");
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const getNGODetails = async () => {
    try {
      const data = await fetchNGODetails();
      console.log("ngo data", data);
      setNGO(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getNGODetails();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getNGODetails();
  };

  const handleViewPosts = () => {
    setViewMode("posts");
  };

  const handleViewCampaigns = () => {
    setViewMode("campaigns");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error removing token", error);
    }
    setModalVisible(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !ngo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error fetching NGO details. Please try again later.
        </Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="logout" size={24} color="#000" />
        </TouchableOpacity>
        {ngo.profilePhoto && (
          <Image
            source={{ uri: ngo.profilePhoto }}
            style={styles.profilePhoto}
          />
        )}
        {ngo.name && <Text style={styles.name}>{ngo.name}</Text>}
        {ngo.missionStatement && (
          <Text style={styles.missionStatement}>{ngo.missionStatement}</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Contact Information</Text>
        <Text style={styles.content}>{ngo.contactInfo}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Founders</Text>
        {ngo.founders.map((founder, index) => (
          <View key={index} style={styles.founder}>
            {founder.image && (
              <Image
                source={{ uri: founder.image }}
                style={styles.founderImage}
              />
            )}
            <View>
              <Text style={styles.founderName}>{founder.name}</Text>
              <Text>{founder.position}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[
            styles.navigationButton,
            viewMode === "posts" && styles.activeNavigationButton,
          ]}
          onPress={handleViewPosts}
        >
          <Text
            style={[
              styles.navigationButtonText,
              viewMode === "posts" && styles.activeNavigationButtonText,
            ]}
          >
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navigationButton,
            viewMode === "campaigns" && styles.activeNavigationButton,
          ]}
          onPress={handleViewCampaigns}
        >
          <Text
            style={[
              styles.navigationButtonText,
              viewMode === "campaigns" && styles.activeNavigationButtonText,
            ]}
          >
            Campaigns
          </Text>
        </TouchableOpacity>
      </View>
      {viewMode === "posts" && <MyPosts posts={ngo.posts} />}
      {viewMode === "campaigns" && <MyCampaigns campaigns={ngo.campaigns} />}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    position: "relative",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  missionStatement: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  section: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
  },
  founder: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  founderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  founderName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  navigationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#007bff",
  },
  navigationButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  activeNavigationButton: {
    backgroundColor: "#0056b3", // Adjust active button style as needed
  },
  activeNavigationButtonText: {
    fontWeight: "bold",
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonYes: {
    backgroundColor: "#28a745",
  },
  modalButtonNo: {
    backgroundColor: "#dc3545",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
