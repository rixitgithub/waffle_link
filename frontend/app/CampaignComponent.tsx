import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface CampaignComponentProps {
  item: any; // Adjust type as per your campaign data structure
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
  const renderIcon = () => {
    let iconName = "bullhorn"; // Default icon for awareness type

    if (item.type === "fundraising") {
      iconName = "hand-holding-usd"; // Icon for fundraising type
    } else if (item.type === "volunteer") {
      iconName = "hand-paper"; // Icon for volunteer type
    }

    return <FontAwesome name={iconName} size={24} color="black" />;
  };

  const renderTypeLabel = () => {
    let typeLabel = "Awareness"; // Default label for awareness type

    if (item.type === "fundraising") {
      typeLabel = "Fundraising"; // Label for fundraising type
    } else if (item.type === "volunteer") {
      typeLabel = "Volunteer"; // Label for volunteer type
    }

    return (
      <View style={styles.typeLabelContainer}>
        <Text style={styles.typeLabelText}>{typeLabel}</Text>
      </View>
    );
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
          onPress={() => onVolunteer && onVolunteer(item._id)}
        >
          <Text style={styles.actionButtonText}>Volunteer</Text>
        </TouchableOpacity>
      );
    }
    return null; // No buttons for awareness type or if functions are not provided
  };

  return (
    <View style={styles.campaignContainer}>
      <View style={styles.header}>
        <Text style={[styles.campaignTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        {renderIcon()}
      </View>
      {renderTypeLabel()}
      <Text style={[styles.campaignDescription, { color: colors.text }]}>
        {item.description}
      </Text>
      {renderButtons()}
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
    borderWidth: 1,
    borderColor: "black",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  typeLabelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
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
});

export default CampaignComponent;
