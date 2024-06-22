import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getCampaignById } from "../api/campaign"; // Adjust import path as per your project structure

const CampaignDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const campaignId = route.params ? route.params.campaignId : null;
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails(campaignId);
    }
  }, [campaignId]);

  const fetchCampaignDetails = async (id) => {
    try {
      const fetchedCampaign = await getCampaignById(id);
      setCampaign(fetchedCampaign);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      // Handle error state if needed
    }
  };

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text>Loading campaign details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{campaign.title}</Text>
      <Text style={styles.description}>{campaign.description}</Text>
      <Text style={styles.subTitle}>NGO: {campaign.ngoId.name}</Text>
      <Text>End Date: {new Date(campaign.endDate).toDateString()}</Text>

      {/* Depending on campaign type, render specific details */}
      {campaign.type === "volunteer" && (
        <View>
          <Text>Volunteer Campaign Details</Text>
          {/* Render volunteer-specific details */}
        </View>
      )}

      {campaign.type === "donation" && (
        <View>
          <Text>Donation Campaign Details</Text>
          {/* Render donation-specific details */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default CampaignDetailScreen;
