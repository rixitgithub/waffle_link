import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { fetchRewardsData } from "../api/user"; // Adjust the path as necessary

// Import badge images statically
import eventAttenderBadge1 from "../assets/images/event_attender_1.png";
import eventAttenderBadge2 from "../assets/images/event_attender_2.png";
import eventAttenderBadge3 from "../assets/images/event_attender_3.png";
import eventAttenderBadge4 from "../assets/images/event_attender_4.png";
import eventAttenderBadge5 from "../assets/images/event_attender_5.png";
import impactInvestorBadge1 from "../assets/images/impact_investor_1.png";
import impactInvestorBadge2 from "../assets/images/impact_investor_2.png";
import impactInvestorBadge3 from "../assets/images/impact_investor_3.png";
import impactInvestorBadge4 from "../assets/images/impact_investor_4.png";
import impactInvestorBadge5 from "../assets/images/impact_investor_5.png";

// Share icons for different platforms
const shareIcons = {
  whatsapp: require("../assets/images/whatsapp.png"),
  facebook: require("../assets/images/facebook.png"),
  twitter: require("../assets/images/twitter.png"),
  linkedin: require("../assets/images/linkedin.png"),
  telegram: require("../assets/images/telegram.png"),
  email: require("../assets/images/gmail.png"),
};
const lockIcon = require("../assets/images/locked.png");

// Badge image mapping
const eventAttenderBadgeMap = {
  "event_attender_1.png": eventAttenderBadge1,
  "event_attender_2.png": eventAttenderBadge2,
  "event_attender_3.png": eventAttenderBadge3,
  "event_attender_4.png": eventAttenderBadge4,
  "event_attender_5.png": eventAttenderBadge5,
};

const impactInvestorBadgeMap = {
  "impact_investor_1.png": impactInvestorBadge1,
  "impact_investor_2.png": impactInvestorBadge2,
  "impact_investor_3.png": impactInvestorBadge3,
  "impact_investor_4.png": impactInvestorBadge4,
  "impact_investor_5.png": impactInvestorBadge5,
};

const RewardsSection = ({ userId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [eventAttenderBadges, setEventAttenderBadges] = useState([]);
  const [impactInvestorBadges, setImpactInvestorBadges] = useState([]);

  useEffect(() => {
    // Function to fetch rewards data
    const fetchRewards = async () => {
      try {
        const rewardsData = await fetchRewardsData(userId);
        setEventAttenderBadges(rewardsData.eventAttenderBadges);
        setImpactInvestorBadges(rewardsData.impactInvestorBadges);
      } catch (error) {
        console.error("Error fetching rewards:", error);
        // Handle error state or retry logic as needed
      }
    };

    fetchRewards();
  }, [userId]); // Trigger fetchRewards on userId change

  const handleBadgePress = (badge) => {
    setSelectedBadge(badge);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleShare = async (badge) => {
    try {
      if (!badge) {
        console.error("Badge is missing.");
        return;
      }

      const { name, level } = badge;
      const message = `Check out my ${name} (${level}) on WaffleApp!`;

      // Display modal to share badge
      setSelectedBadge(badge);
      setModalVisible(true);
    } catch (error) {
      console.error("Error handling share:", error);
    }
  };

  const shareToApp = async (app) => {
    try {
      let url = "";
      let appName = "";

      switch (app) {
        case "whatsapp":
          url = `whatsapp://send?text=${encodeURIComponent(
            selectedBadge.name + " - " + selectedBadge.level
          )}`;
          appName = "WhatsApp";
          break;
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            "https://yourwebsite.com"
          )}`;
          appName = "Facebook";
          break;
        case "twitter":
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            selectedBadge.name + " - " + selectedBadge.level
          )}`;
          appName = "Twitter";
          break;
        case "linkedin":
          url = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
            "https://yourwebsite.com"
          )}&title=${encodeURIComponent(
            selectedBadge.name
          )}&summary=${encodeURIComponent(selectedBadge.level)}`;
          appName = "LinkedIn";
          break;
        case "telegram":
          url = `https://telegram.me/share/url?url=${encodeURIComponent(
            "https://yourwebsite.com"
          )}&text=${encodeURIComponent(
            selectedBadge.name + " - " + selectedBadge.level
          )}`;
          appName = "Telegram";
          break;
        case "email":
          url = `mailto:?subject=${encodeURIComponent(
            "Check out my badge on WaffleApp!"
          )}&body=${encodeURIComponent(
            selectedBadge.name + " - " + selectedBadge.level
          )}`;
          appName = "Email";
          break;
        default:
          return;
      }

      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(
          `${appName} Not Installed`,
          `${appName} is required to share badges. Please install ${appName} to share.`,
          [{ text: "OK", onPress: () => {} }]
        );
        return;
      }

      Linking.openURL(url).catch((err) =>
        console.error(`Error opening ${appName}:`, err)
      );
    } catch (error) {
      console.error("Error sharing to app:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Event Attender Section */}
      <SectionHeader title="Event Attender" />
      <View style={styles.badgesContainer}>
        {eventAttenderBadges.map((badge, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.badgeWrapper,
              badge.locked ? styles.lockedBadge : null,
            ]}
            onPress={() => handleBadgePress(badge)}
          >
            <Image
              source={eventAttenderBadgeMap[badge.image]}
              style={styles.badgeImage}
            />
            {badge.locked && (
              <Image source={lockIcon} style={styles.lockIcon} />
            )}
            <Text style={styles.badgeLabel}>{badge.name}</Text>
            <Text style={styles.badgeLevel}>{badge.level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Impact Investor Section */}
      <SectionHeader title="Impact Investor" />
      <View style={styles.badgesContainer}>
        {impactInvestorBadges.map((badge, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.badgeWrapper,
              badge.locked ? styles.lockedBadge : null,
            ]}
            onPress={() => handleBadgePress(badge)}
          >
            <Image
              source={impactInvestorBadgeMap[badge.image]}
              style={styles.badgeImage}
            />
            {badge.locked && (
              <Image source={lockIcon} style={styles.lockIcon} />
            )}
            <Text style={styles.badgeLabel}>{badge.name}</Text>
            <Text style={styles.badgeLevel}>{badge.level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal for Badge Details and Sharing */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedBadge && (
            <View style={styles.modalContent}>
              <Image
                source={
                  eventAttenderBadgeMap[selectedBadge.image] ||
                  impactInvestorBadgeMap[selectedBadge.image]
                }
                style={styles.modalBadgeImage}
              />
              <Text style={styles.modalBadgeLabel}>{selectedBadge.name}</Text>
              <Text style={styles.modalBadgeLevel}>{selectedBadge.level}</Text>
              {!selectedBadge.locked && (
                <View style={styles.shareButtonsContainer}>
                  {Object.keys(shareIcons).map((app, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.shareButton}
                      onPress={() => shareToApp(app)}
                    >
                      <Image
                        source={shareIcons[app]}
                        style={styles.shareIcon}
                      />
                      <Text style={styles.shareButtonText}>{app}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

// SectionHeader component
const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  badgeWrapper: {
    width: "48%",
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    backgroundColor: "#f0f0f0", // Optional: Add background color for badges
  },
  badgeImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  lockedBadge: {
    opacity: 0.5,
  },
  lockIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  badgeLabel: {
    paddingHorizontal: 10,
    paddingTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  badgeLevel: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    fontSize: 14,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalBadgeImage: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    marginBottom: 10,
  },
  modalBadgeLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalBadgeLevel: {
    fontSize: 16,
    marginBottom: 10,
  },
  shareButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  shareButton: {
    alignItems: "center",
  },
  shareIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  shareButtonText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    width: "80%",
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0", // Optional: Add background color for section header
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RewardsSection;
