import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { getCampaigns, saveUpdate } from "../api/campaign"; // Adjust import path as per your project structure

interface UpdateModalProps {
  visible: boolean;
  onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ visible, onClose }) => {
  const [campaigns, setCampaigns] = useState<{ id: string; title: string }[]>(
    []
  );
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [updateHeader, setUpdateHeader] = useState<string>("");
  const [updateImages, setUpdateImages] = useState<string[]>([]);
  const [mapRegion, setMapRegion] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const fetchedCampaigns = await getCampaigns();
        setCampaigns(fetchedCampaigns.campaigns || []);
        if (fetchedCampaigns.campaigns?.length > 0) {
          setSelectedCampaign(fetchedCampaigns.campaigns[0].id); // Set the first campaign as default selection
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    if (visible) {
      fetchCampaigns();
    }
  }, [visible]);

  useEffect(() => {
    // Set default coordinates when modal is opened
    setMapRegion({
      latitude: 28.6304,
      longitude: 77.2177,
    });
  }, [visible]);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMapRegion({ latitude, longitude });
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setUpdateImages([...updateImages, ...newImages]);
    }
  };

  const handleSaveUpdate = async () => {
    try {
      await saveUpdate({
        campaignId: selectedCampaign,
        header: updateHeader,
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
        images: updateImages,
      });
      Alert.alert("Update Saved!", "Your update has been successfully saved.");
      onClose();
    } catch (error) {
      console.error("Error saving update:", error);
      Alert.alert("Error", "There was an error saving the update.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.liveIndicator}>
              <View style={styles.blinkingCircle} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Ionicons name="close" size={30} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalTitle}>Add Update</Text>
          <Picker
            selectedValue={selectedCampaign}
            onValueChange={(itemValue) => setSelectedCampaign(itemValue)}
            style={styles.dropdown}
          >
            {campaigns.map((campaign) => (
              <Picker.Item
                key={campaign.id}
                label={campaign.title}
                value={campaign.id}
              />
            ))}
          </Picker>
          <TextInput
            placeholder="Update Header"
            style={styles.inputField}
            value={updateHeader}
            onChangeText={(text) => setUpdateHeader(text)}
          />
          <ScrollView horizontal>
            {updateImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.imagePreview}
              />
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleImageUpload}
          >
            <Ionicons name="camera" size={30} color="#4CAF50" />
            <Text style={styles.iconButtonText}>Upload Image</Text>
          </TouchableOpacity>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                ...mapRegion,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleMapPress}
            >
              {/* Default Marker */}
              <Marker coordinate={mapRegion} />
            </MapView>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveUpdate}
            disabled={
              !selectedCampaign || !updateHeader || updateImages.length === 0
            }
          >
            <Text style={styles.saveButtonText}>Save Update</Text>
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
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  blinkingCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginRight: 5,
    animation: "blinking 1s infinite",
  },
  liveText: {
    color: "red",
    fontWeight: "bold",
  },
  closeIcon: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdown: {
    width: "100%",
    marginBottom: 20,
  },
  inputField: {
    width: "100%",
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconButtonText: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginLeft: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  mapContainer: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UpdateModal;
