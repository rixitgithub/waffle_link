import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps"; // Import MapView and Marker from react-native-maps

const CampaignDetailScreen = () => {
  const [campaign, setCampaign] = useState({
    title: "Campaign Title",
    description: "Campaign Description",
    endDate: new Date(),
    currency: "USD",
    goal: 10000,
    progress: {
      fundraising: {
        currentAmount: 5000,
        donors: [
          { name: "John Doe", amount: 100 },
          { name: "Jane Smith", amount: 200 },
          { name: "Bob Johnson", amount: 300 },
        ],
      },
      volunteer: {
        currentVolunteers: 50,
        recentActivities: [
          { title: "Activity 1", description: "Description of Activity 1" },
          { title: "Activity 2", description: "Description of Activity 2" },
        ],
      },
    },
    updates: [
      {
        title: "Update 1",
        content: "This is update 1 content.",
        date: new Date(),
        location: {
          latitude: 37.78825,
          longitude: -122.4324,
        },
      },
      {
        title: "Update 2",
        content: "This is update 2 content.",
        date: new Date(),
        location: {
          latitude: 37.7895,
          longitude: -122.4345,
        },
      },
    ],
  });

  useEffect(() => {
    // Simulate fetching campaign details from API
    // Replace this with your actual API call using getCampaignById
    // const fetchCampaignDetails = async (id) => {
    //   try {
    //     const fetchedCampaign = await getCampaignById(id);
    //     setCampaign(fetchedCampaign);
    //   } catch (error) {
    //     console.error("Error fetching campaign details:", error);
    //     // Handle error state if needed
    //   }
    // };
    // fetchCampaignDetails(campaignId); // Assuming campaignId is fetched from route
    // Simulating delay for demonstration
    // setTimeout(() => {
    //   setCampaign(dummyCampaignData);
    // }, 1000); // Replace with actual fetch and state update
  }, []);

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
      <Text>End Date: {campaign.endDate.toDateString()}</Text>

      {campaign.progress.fundraising && (
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
          <Text style={styles.subTitle}>Top Donors</Text>
          <View style={styles.donorList}>
            {campaign.progress.fundraising.donors
              .slice(0, 3)
              .map((donor, index) => (
                <TouchableOpacity key={index} style={styles.donorItem}>
                  <Text style={styles.donorName}>{donor.name}</Text>
                  <Text style={styles.donationAmount}>
                    {donor.amount} {campaign.currency}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      )}

      {campaign.progress.volunteer && (
        <View>
          <Text style={styles.sectionTitle}>Volunteer Details</Text>
          <Text>
            Current Volunteers: {campaign.progress.volunteer.currentVolunteers}
          </Text>
          <Text style={styles.subTitle}>Recent Activities</Text>
          <View style={styles.activityList}>
            {campaign.progress.volunteer.recentActivities.map(
              (activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                </View>
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
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  donorList: {
    marginTop: 10,
  },
  donorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 5,
    borderRadius: 5,
  },
  donorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  donationAmount: {
    fontSize: 14,
  },
  activityList: {
    marginTop: 10,
  },
  activityItem: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 5,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activityDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  updatesSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  updateItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#e1f5fe",
    borderRadius: 10,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  updateText: {
    fontSize: 16,
    marginBottom: 5,
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
