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

interface Campaign {
  _id: string;
  title: string;
  description: string;
  type: string;
  goal: number;
  currency: string;
  endDate: string;
  volunteerCount: number | null;
  skills: string[];
  shares: number | null;
  likes: number | null;
  ngoId: {
    category: string;
    name: string;
    profilePhoto: string;
  };
  progress: {
    awareness: { currentShares: number; currentLikes: number };
    fundraising: { currentAmount: number };
    volunteer: { currentVolunteers: number };
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
        (item.progress.fundraising.currentAmount / item.goal) * 100;

      return (
        <View style={styles.detailsContainer}>
          <Text style={[styles.detailText, { color: colors.text }]}>
            <Text style={styles.detailLabel}>Goal: </Text>
            {item.currency} {item.goal}
          </Text>
          <Text style={[styles.raisedText, { color: colors.primary }]}>
            <Text style={styles.detailLabel}>Raised: </Text>
            {item.currency} {item.progress.fundraising.currentAmount}
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
            {item.progress.volunteer.currentVolunteers}
          </Text>
          {item.skills.length > 0 && (
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
            {item.progress.awareness.currentShares}
          </Text>
          <Text style={[styles.detailText, { color: colors.text }]}>
            <Text style={styles.detailLabel}>Likes: </Text>
            {item.progress.awareness.currentLikes}
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

  const handleVolunteerSubmit = () => {
    console.log("Volunteer Text:", volunteerText);
    setModalVisible(false);
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
    flex: 1,
  },
  campaignDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  typeLabelContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15, // Rounded corners
    alignSelf: "flex-end",
  },
  typeLabelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25, // More rounded corners
    marginTop: 10,
    alignItems: "center",
  },
  donateButton: {
    backgroundColor: "#1E90FF", // Elegant blue color for donate button
  },
  volunteerButton: {
    backgroundColor: "#32CD32", // Elegant green color for volunteer button
  },
  actionButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  ngoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  ngoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  ngoDetails: {
    flex: 1,
  },
  ngoName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  ngoCategory: {
    fontSize: 12,
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
  },
  raisedText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailLabel: {
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 10,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 5,
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  skillsContainer: {
    marginTop: 10,
  },
  skillsTagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  skillTagText: {
    fontSize: 12,
    color: "#333",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default CampaignComponent;
