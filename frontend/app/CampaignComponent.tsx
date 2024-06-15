import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface CampaignComponentProps {
  item: any; // Adjust type as per your campaign data structure
  colors: any; // Adjust type as per your Colors definition
  onJoin: (campaignId: string) => void; // Function to handle join action
  onUpvote: (campaignId: string) => void; // Function to handle upvote action
}

const CampaignComponent: React.FC<CampaignComponentProps> = ({
  item,
  colors,
  onJoin,
  onUpvote,
}) => {
  const renderProgress = () => {
    if (item.type === "fundraising") {
      return (
        <Text style={[styles.progressText, { color: colors.text }]}>
          Raised: {item.progress.fundraising.current}/{item.goal}{" "}
          {item.currency}
        </Text>
      );
    } else if (item.type === "awareness") {
      return (
        <Text style={[styles.progressText, { color: colors.text }]}>
          Awareness: {item.progress.awareness.current} people reached
        </Text>
      );
    } else if (item.type === "volunteer") {
      return (
        <Text style={[styles.progressText, { color: colors.text }]}>
          Volunteers: {item.progress.volunteer.current}/{item.volunteerCount}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={[styles.campaignContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.campaignTitle, { color: colors.text }]}>
        {item.title}
      </Text>
      <Text style={[styles.campaignDescription, { color: colors.text }]}>
        {item.description}
      </Text>
      {renderProgress()}
      <View style={styles.campaignStats}>
        <View style={styles.statsLeft}>
          <FontAwesome
            name="heart"
            size={20}
            style={[styles.statIcon, { color: colors.inactive }]}
          />
          <Text style={[styles.statText, { color: colors.inactive }]}>
            {item.likes ?? 0}
          </Text>
          <FontAwesome
            name="share"
            size={20}
            style={[styles.statIcon, { color: colors.inactive }]}
          />
          <Text style={[styles.statText, { color: colors.inactive }]}>
            {item.shares ?? 0}
          </Text>
        </View>
        <View style={styles.statsRight}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => onJoin(item._id)}
          >
            <Text style={styles.actionButtonText}>Join</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={() => onUpvote(item._id)}
          >
            <Text style={styles.actionButtonText}>Upvote</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  campaignContainer: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  campaignDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 10,
  },
  campaignStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  statsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    marginRight: 5,
  },
  statText: {
    marginRight: 15,
    fontSize: 14,
    color: "gray",
  },
  statsRight: {
    flexDirection: "row",
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  actionButtonText: {
    fontSize: 14,
    color: "white",
  },
});

export default CampaignComponent;
