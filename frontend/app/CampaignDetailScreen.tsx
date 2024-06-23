import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import Swiper from "react-native-swiper";
import { getCampaignById, Donate } from "../api/campaign";

const CampaignDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const campaignId = route.params ? route.params.campaignId : null;
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationModalVisible, setDonationModalVisible] = useState(false);

  const fetchCampaignDetails = async (id) => {
    try {
      const fetchedCampaign = await getCampaignById(id);
      console.log("fetched", fetchedCampaign);
      setCampaign(fetchedCampaign);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails(campaignId);
    }
  }, [campaignId]);

  const handleDonateNow = () => {
    setDonationModalVisible(true);
  };

  const handleConfirmDonation = async () => {
    try {
      const result = await Donate(campaignId, donationAmount);

      Alert.alert(
        "Donation Successful",
        `You have donated ${result.amount} ${campaign.currency}. Thank you!`,
        [
          {
            text: "OK",
            onPress: () => {
              setDonationModalVisible(false);
              fetchCampaignDetails(campaignId); // Refresh campaign details
            },
          },
        ],
        { cancelable: false }
      );

      // Additional logic after successful donation (if needed)
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text>Loading campaign details...</Text>
      </View>
    );
  }

  const getProgressPercentage = () => {
    const currentAmount = campaign.progress.fundraising.currentAmount;
    const goal = campaign.goal;
    return (currentAmount / goal) * 100;
  };

  // Prepare donors data in descending order of amount
  const sortedDonors = campaign.progress.fundraising.donors
    ? campaign.progress.fundraising.donors.sort((a, b) => b.amount - a.amount)
    : [];

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {/* Campaign Title */}
        <Text style={[styles.title, { marginTop: 20, textAlign: "center" }]}>
          {campaign.title}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { textAlign: "center" }]}>
          {campaign.description}
        </Text>

        {/* Ends On */}
        <Text style={[styles.endsOnText, { textAlign: "center" }]}>
          Ends On: {new Date(campaign.endDate).toLocaleDateString()}
        </Text>

        {/* Fundraising Progress */}
        {campaign.type === "fundraising" && (
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>
                  Goal ({campaign.currency})
                </Text>
                <Text style={styles.progressAmount}>{campaign.goal}</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>
                  Raised ({campaign.currency})
                </Text>
                <Text style={styles.progressAmount}>
                  {campaign.progress.fundraising.currentAmount}{" "}
                </Text>
              </View>
            </View>
            {/* Custom Progress Bar */}
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${getProgressPercentage()}%` },
                ]}
              />
            </View>
          </View>
        )}

        {/* Donors Table or No Donors Yet */}
        {campaign.type === "fundraising" && (
          <View style={styles.donorsContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTextLeft}>Top Donors</Text>
              <TouchableOpacity
                style={styles.donateButton}
                onPress={handleDonateNow}
              >
                <Text style={styles.donateButtonText}>Donate</Text>
              </TouchableOpacity>
            </View>
            {sortedDonors.length > 0 ? (
              <FlatList
                data={sortedDonors}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.donorItem}>
                    <View style={styles.donorLeft}>
                      <Text style={styles.donorName}>{item.user.name}</Text>
                      <Text style={styles.donorEmail}>{item.user.email}</Text>
                    </View>
                    <Text style={styles.donorDescription}>
                      {item.usedFor || "-"}
                    </Text>
                    <Text style={styles.donorAmount}>
                      {item.amount} {campaign.currency}
                    </Text>
                  </View>
                )}
                ListHeaderComponent={() => (
                  <View style={styles.donorItem}>
                    <Text
                      style={[styles.donorDescription, { fontWeight: "bold" }]}
                    >
                      Name
                    </Text>
                    <Text
                      style={[styles.donorDescription, { fontWeight: "bold" }]}
                    >
                      Email
                    </Text>
                    <Text
                      style={[
                        styles.donorDescription,
                        { fontWeight: "bold", textAlign: "right" },
                      ]}
                    >
                      Amount
                    </Text>
                  </View>
                )}
              />
            ) : (
              <View style={styles.noDonorsContainer}>
                <Text>No donors yet.</Text>
              </View>
            )}
          </View>
        )}

        {/* Display Volunteers */}
        {/* Display Volunteers */}
        {campaign.type === "volunteer" && (
          <View style={styles.volunteersContainer}>
            <Text style={styles.sectionTitle}>Volunteers</Text>
            {campaign.progress.volunteer.volunteer_recruited.length > 0 ? (
              <FlatList
                data={campaign.progress.volunteer.volunteer_recruited}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.volunteerCard}>
                    <View style={styles.cardContent}>
                      <Image
                        source={{ uri: item.profilePicture }}
                        style={styles.volunteerImage}
                      />
                      <Text style={styles.volunteerName}>{item.name}</Text>
                      <Text style={styles.volunteerEmail}>{item.email}</Text>
                      <Text style={styles.volunteerBio}>{item.bio}</Text>
                    </View>
                  </View>
                )}
                numColumns={2} // Display two cards per row
              />
            ) : (
              <View style={styles.noVolunteersContainer}>
                <Text>No volunteers yet.</Text>
              </View>
            )}
          </View>
        )}

        {/* Updates Section */}
        <View style={styles.updatesSection}>
          <Text style={styles.sectionTitle}>Latest Updates</Text>
          {campaign.updates.length > 0 ? (
            campaign.updates.map((update, index) => (
              <View key={index} style={styles.updateItem}>
                <Text style={styles.updateTitle}>{update.header}</Text>
                <Text style={styles.updateDate}>
                  {new Date(update.updatedAt).toLocaleDateString()}
                </Text>
                {update.mapDetails &&
                  update.mapDetails.latitude &&
                  update.mapDetails.longitude && (
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: update.mapDetails.latitude,
                        longitude: update.mapDetails.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: update.mapDetails.latitude,
                          longitude: update.mapDetails.longitude,
                        }}
                        title="Update Location"
                      />
                    </MapView>
                  )}
                <Swiper style={styles.imageSlider}>
                  {update.images.map((image, imgIndex) => (
                    <View key={imgIndex}>
                      <Image
                        source={{ uri: image }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </Swiper>
              </View>
            ))
          ) : (
            <Text>No updates yet.</Text>
          )}
        </View>
      </View>

      {/* Donation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={donationModalVisible}
        onRequestClose={() => setDonationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Donate Now</Text>
            <TextInput
              style={styles.donationInput}
              placeholder="Enter donation amount"
              keyboardType="numeric"
              value={donationAmount}
              onChangeText={(text) => setDonationAmount(text)}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleConfirmDonation}
            >
              <Text style={styles.modalButtonText}>Confirm Donation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setDonationModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  endsOnText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  updatesSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  updateItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
    marginBottom: 10,
    borderRadius: 10,
  },
  imageSlider: {
    height: 200,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  progressContainer: {
    marginTop: 20,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  progressItem: {
    alignItems: "center",
  },
  progressLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  progressAmount: {
    fontSize: 30,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 5,
  },
  progressFill: {
    height: "100%",
    width: "60%",
    backgroundColor: "green",
  },
  donorsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTextLeft: {
    fontSize: 18,
    fontWeight: "bold",
  },
  donateButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  donateButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  donorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  donorLeft: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  donorEmail: {
    fontSize: 14,
    color: "#666",
  },
  donorDescription: {
    fontSize: 16,
    flex: 2,
    textAlign: "center",
  },
  donorAmount: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  noDonorsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  donationInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "80%",
    marginBottom: 20,
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: "60%",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  volunteersContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  volunteerCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  volunteerEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  volunteerRole: {
    fontSize: 14,
    color: "blue",
    marginBottom: 5,
  },
  noVolunteersContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 20,
  },
  cardContent: {
    padding: 10,
    alignItems: "center",
  },
  volunteerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  volunteerBio: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default CampaignDetailScreen;
