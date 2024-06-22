import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps"; // Import MapView and Marker from react-native-maps
import { useNavigation, useRoute } from "@react-navigation/native";
import { getCampaignById } from "../api/campaign"; // Adjust import path as per your project structure

const CampaignDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const campaignId = route.params ? route.params.campaignId : null;
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaignDetails = async (id) => {
      try {
        const fetchedCampaign = await getCampaignById(id);
        console.log("fetched campaign", fetchedCampaign);
        setCampaign(fetchedCampaign);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
        // Handle error state if needed
      }
    };

    if (campaignId) {
      fetchCampaignDetails(campaignId);
    }
  }, [campaignId]);

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text>Loading campaign details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{campaign.title}</Text>
      <Text style={styles.description}>{campaign.description}</Text>
      <Text>End Date: {new Date(campaign.endDate).toDateString()}</Text>

      {campaign.type === "fundraising" && (
        <View>
          <Text style={styles.sectionTitle}>Fundraising Progress</Text>
          <Text>Currency: {campaign.currency}</Text>
          <Text>
            Goal: {campaign.goal} {campaign.currency}
          </Text>
          <Text>
            Current Amount Raised: {campaign.progress.fundraising.currentAmount}{" "}
            {campaign.currency}
          </Text>
          <Text>Donors:</Text>
          <View>
            {campaign.progress.fundraising.donors.map((donor, index) => (
              <Text key={index}>{donor}</Text>
            ))}
          </View>
        </View>
      )}

      {campaign.type === "volunteer" && (
        <View>
          <Text style={styles.sectionTitle}>Volunteer Details</Text>
          <Text>
            Current Volunteers: {campaign.progress.volunteer.currentVolunteers}
          </Text>
          <Text>Volunteers Recruited:</Text>
          <View>
            {campaign.progress.volunteer.volunteer_recruited.map(
              (volunteer, index) => (
                <Text key={index}>{volunteer}</Text>
              )
            )}
          </View>
          <Text>Volunteer Requests:</Text>
          <View>
            {campaign.progress.volunteer.volunteer_request.map(
              (request, index) => (
                <Text key={index}>{request}</Text>
              )
            )}
          </View>
        </View>
      )}

      {/* Updates Section */}
      <View style={styles.updatesSection}>
        <Text style={styles.sectionTitle}>Latest Updates</Text>
        {campaign.updates.map((update, index) => (
          <TouchableOpacity key={index} style={styles.updateItem}>
            <Text style={styles.updateTitle}>{update.title}</Text>
            <Text style={styles.updateText}>{update.content}</Text>
            <Text style={styles.updateDate}>
              {new Date(update.date).toLocaleDateString()}
            </Text>
            {update.location &&
              update.location.latitude &&
              update.location.longitude && (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: update.location.latitude,
                    longitude: update.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: update.location.latitude,
                      longitude: update.location.longitude,
                    }}
                    title="Update Location"
                  />
                </MapView>
              )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  updatesSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  updateItem: {
    marginBottom: 15,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  updateText: {
    fontSize: 16,
  },
  updateDate: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  map: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default CampaignDetailScreen;
