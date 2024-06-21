import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { sendVolunteerRequest } from "../api/campaign"; // Import your sendVolunteerRequest function

interface Campaign {
  _id: string;
  title: string;
  description: string;
  type: string;
  goal?: number; // Optional for non-fundraising types
  currency?: string; // Optional for non-fundraising types
  endDate: string;
  volunteerCount?: number | null; // Optional for non-volunteer types
  skills?: string[]; // Optional for non-volunteer types
  shares?: number | null; // Optional for non-awareness types
  likes?: number | null; // Optional for non-awareness types
  ngoId: {
    category: string;
    name: string;
    profilePhoto: string;
  };
  progress: {
    awareness?: {
      currentShares: number;
      currentLikes: number;
    }; // Optional for non-awareness types
    fundraising?: {
      currentAmount: number;
      donors?: {
        user: string; // Reference to User _id (ObjectId as string)
        amount: number;
      }[];
    }; // Optional for non-fundraising types
    volunteer?: {
      currentVolunteers: number;
      volunteer_request?: {
        user: string; // Reference to User _id (ObjectId as string)
        text: string;
      }[];
      volunteer_recruited?: string[]; // Array of User _ids (ObjectIds as strings)
    }; // Optional for non-volunteer types
  };
}

interface CampaignComponentProps {
  item: Campaign;
  colors: any; // Adjust type as per your Colors definition
  onDonate?: (campaignId: string) => void; // Function to handle donate action (optional)
  onVolunteer?: (campaignId: string) => void; // Function to handle volunteer action (optional)
}

const CampaignComponent: React.FC<CampaignComponentProps> = ({
  item,
  colors,
  onDonate,
  onVolunteer,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [volunteerText, setVolunteerText] = useState("");

  const renderTypeLabel = () => {
    let typeLabel = "Awareness"; // Default label for awareness type

    if (item.type === "fundraising") {
      typeLabel = "Fundraising"; // Label for fundraising type
    } else if (item.type === "volunteer") {
      typeLabel = "Volunteer"; // Label for volunteer type
    }

    return (
      <View
        style={[
          styles.typeLabelContainer,
          { backgroundColor: getTypeColor(item.type) },
        ]}
      >
        <Text style={styles.typeLabelText}>{typeLabel}</Text>
      </View>
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "fundraising":
        return "#1E90FF"; // Blue for fundraising
      case "volunteer":
        return "#32CD32"; // Green for volunteer
      default:
        return "#ccc"; // Default color for other types
    }
  };

  const renderDetails = () => {
    if (item.type === "fundraising") {
      const progressPercentage =
        (item.progress.fundraising?.currentAmount / item.goal!) * 100;

      return (
        <View style={styles.detailsContainer}>
          <Text style={[styles.detailText, { color: colors.text }]}>
            <Text style={styles.detailLabel}>Goal: </Text>
            {item.currency} {item.goal}
          </Text>
          <Text style={[styles.raisedText, { color: colors.primary }]}>
            <Text style={styles.detailLabel}>Raised: </Text>
            {item.currency} {item.progress.fundraising?.currentAmount}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>
      );
    } else if (item.type === "volunteer") {
      return (
        <View style={styles.detailsContainer}>
          <Text style={[styles.detailText, { color: colors.text }]}>
            <Text style={styles.detailLabel}>Required Volunteers: </Text>
            {item.volunteerCount}
          </Text>
          <Text style={[styles.detailText, { color: colors.text }]}>
            <Text style={styles.detailLabel}>Current Volunteers: </Text>
            {item.progress.volunteer?.currentVolunteers}
          </Text>
          {item.skills && item.skills.length > 0 && (
            <View style={styles.skillsContainer}>
              <Text style={[styles.detailText, { color: colors.text }]}>
                Skills Required:
              </Text>
              <View style={styles.skillsTagContainer}>
                {item.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.detailsContainer}>
          <Text style={[styles.detailText, { color: colors.text }]}>
            <Text style={styles.detailLabel}>Shares: </Text>
            {item.progress.awareness?.currentShares}
          </Text>
          <Text style={[styles.detailText, { color: colors.text }]}>
            <Text style={styles.detailLabel}>Likes: </Text>
            {item.progress.awareness?.currentLikes}
          </Text>
        </View>
      );
    }
  };

  const renderButtons = () => {
    if (item.type === "fundraising") {
      return (
        <TouchableOpacity
          style={[styles.actionButton, styles.donateButton]}
          onPress={() => onDonate && onDonate(item._id)}
        >
          <Text style={styles.actionButtonText}>Donate</Text>
        </TouchableOpacity>
      );
    } else if (item.type === "volunteer") {
      return (
        <TouchableOpacity
          style={[styles.actionButton, styles.volunteerButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>Volunteer</Text>
        </TouchableOpacity>
      );
    }
    return null; // No buttons for awareness type or if functions are not provided
  };

  const handleVolunteerSubmit = async () => {
    if (volunteerText.trim() === "") {
      // Optionally handle empty volunteer text
      return;
    }

    const requestData = {
      campaignId: item._id,
      text: volunteerText,
    };

    try {
      const newUser = await sendVolunteerRequest(requestData);
      console.log("User created:", newUser);
      setModalVisible(false);
      setShowSuccessMessage(true);
      setSuccessMessage("Submitted successfully!!!");

      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage("");
      }, 3000);
      // Optionally, perform any additional actions upon successful volunteer submission
    } catch (error) {
      console.error("Error creating user:", error.message);
      // Optionally, handle and display the error message to the user
    }
  };

  return (
    <View style={[styles.campaignContainer, { backgroundColor: colors.card }]}>
      <View style={styles.ngoContainer}>
        <Image
          source={{ uri: item.ngoId.profilePhoto }}
          style={styles.ngoImage}
        />
        <View style={styles.ngoDetails}>
          <Text style={[styles.ngoName, { color: colors.text }]}>
            {item.ngoId.name}
          </Text>
          <Text style={[styles.ngoCategory, { color: colors.inactive }]}>
            {item.ngoId.category}
          </Text>
          {renderTypeLabel()}
        </View>
      </View>
      <View style={styles.header}>
        <Text style={[styles.campaignTitle, { color: colors.text }]}>
          {item.title}
        </Text>
      </View>
      <Text style={[styles.campaignDescription, { color: colors.text }]}>
        {item.description}
      </Text>
      {renderDetails()}
      {renderButtons()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Volunteer Form</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write something"
              value={volunteerText}
              onChangeText={setVolunteerText}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Yes" onPress={handleVolunteerSubmit} />
              <Button
                title="No"
                onPress={() => setModalVisible(!modalVisible)}
              />
            </View>
          </View>
        </View>
      </Modal>
      {showSuccessMessage && (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessageText}>{successMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  campaignContainer: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff", // Set a default background color
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    position: "relative",
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  campaignDescription: {
    marginBottom: 10,
  },
  ngoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ngoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  ngoDetails: {
    flex: 1,
  },
  ngoName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ngoCategory: {
    fontSize: 14,
    fontStyle: "italic",
  },
  typeLabelContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  typeLabelText: {
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "uppercase",
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailText: {
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  raisedText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  skillsContainer: {
    marginTop: 10,
  },
  skillsTagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  skillTag: {
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  skillTagText: {
    fontSize: 12,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  donateButton: {
    backgroundColor: "#1E90FF",
  },
  volunteerButton: {
    backgroundColor: "#32CD32",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  successMessageContainer: {
    backgroundColor: "rgba(0, 255, 0, 0.9)", // Green color for success message background
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  successMessageText: {
    color: "#fff", // White text color for success message
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CampaignComponent;
