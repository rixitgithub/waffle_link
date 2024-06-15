import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface CampaignComponentProps {
  item: any; // Adjust type as per your campaign data structure
  colors: any; // Adjust type as per your Colors definition
}

const CampaignComponent: React.FC<CampaignComponentProps> = ({
  item,
  colors,
}) => {
  return (
    <View style={[styles.campaignContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.campaignTitle, { color: colors.text }]}>
        {item.title}
      </Text>
      <Text style={[styles.campaignDescription, { color: colors.text }]}>
        {item.description}
      </Text>
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
});

export default CampaignComponent;
