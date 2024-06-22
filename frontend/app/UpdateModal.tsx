import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { getCampaigns } from "../api/campaign"; // Adjust import path as per your project structure
import { Picker } from "@react-native-picker/picker";

interface UpdateModalProps {
  visible: boolean;
  onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ visible, onClose }) => {
  const [campaigns, setCampaigns] = useState<string[]>([]); // State to store fetched campaigns
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");

  useEffect(() => {
    // Fetch campaigns from backend when modal becomes visible
    const fetchCampaigns = async () => {
      try {
        const fetchedCampaigns = await getCampaigns(); // Assuming getCampaigns fetches an array of campaign names
        console.log("fetched", fetchedCampaigns);
        setCampaigns(fetchedCampaigns.campaignTitles);
        if (fetchedCampaigns.length > 0) {
          setSelectedCampaign(fetchedCampaigns[0]); // Set the first campaign as default selection
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        // Handle error state if needed
      }
    };

    if (visible) {
      fetchCampaigns();
    }
  }, [visible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Update</Text>
          {campaigns.length > 0 ? (
            <Picker
              selectedValue={selectedCampaign}
              onValueChange={(itemValue) => setSelectedCampaign(itemValue)}
              style={styles.dropdown}
            >
              {campaigns.map((campaign, index) => (
                <Picker.Item key={index} label={campaign} value={campaign} />
              ))}
            </Picker>
          ) : (
            <Text>No campaigns available</Text>
          )}
          {/* Your update creation form or content goes here */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdown: {
    width: "100%",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UpdateModal;
