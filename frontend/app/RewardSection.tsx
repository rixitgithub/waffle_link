import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";

// Event Attender badge images
const eventAttenderBadgeImages = [
  require("../assets/images/event_attender_5.png"),
  require("../assets/images/event_attender_4.png"),
  require("../assets/images/event_attender_3.png"),
  require("../assets/images/event_attender_2.png"),
  require("../assets/images/event_attender_1.png"),
];

// Impact Investor badge images
const impactInvestorBadgeImages = [
  require("../assets/images/impact_investor_5.png"),
  require("../assets/images/impact_investor_4.png"),
  require("../assets/images/impact_investor_3.png"),
  require("../assets/images/impact_investor_2.png"),
  require("../assets/images/impact_investor_1.png"),
];

// Lock icon image
const lockIcon = require("../assets/images/locked.png");

const eventAttenderBadges = [
  {
    image: eventAttenderBadgeImages[0],
    name: "Bronze Badge",
    level: "Attended 3 Events",
    locked: false, // Example: Initially unlocked
  },
  {
    image: eventAttenderBadgeImages[1],
    name: "Silver Badge",
    level: "Attended 10 Events",
    locked: true,
  },
  {
    image: eventAttenderBadgeImages[2],
    name: "Golden Badge",
    level: "Attended 25 Events",
    locked: true,
  },
  {
    image: eventAttenderBadgeImages[3],
    name: "Platinum Badge",
    level: "Attended 50 Events",
    locked: true,
  },
  {
    image: eventAttenderBadgeImages[4],
    name: "Diamond Badge",
    level: "Attended 100 Events",
    locked: true,
  },
];

const impactInvestorBadges = [
  {
    image: impactInvestorBadgeImages[0],
    name: "Impact Bronze Badge",
    level: "Contributed $500",
    locked: false,
  },
  {
    image: impactInvestorBadgeImages[1],
    name: "Impact Silver Badge",
    level: "Contributed $1000",
    locked: false,
  },
  {
    image: impactInvestorBadgeImages[2],
    name: "Impact Golden Badge",
    level: "Contributed $5000",
    locked: true,
  },
  {
    image: impactInvestorBadgeImages[3],
    name: "Impact Platinum Badge",
    level: "Contributed $10000",
    locked: true,
  },
  {
    image: impactInvestorBadgeImages[4],
    name: "Impact Diamond Badge",
    level: "Contributed $50000",
    locked: true,
  },
];

const RewardsSection = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const handleBadgePress = (badge) => {
    setSelectedBadge(badge);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const shareBadge = async () => {
    if (!selectedBadge) return;

    const { name, level } = selectedBadge;
    const message = `Check out my ${name} (${level}) on WaffleApp!`;

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      Alert.alert(
        "WhatsApp Not Installed",
        "WhatsApp is required to share badges. Please install WhatsApp to share.",
        [{ text: "OK", onPress: () => {} }]
      );
      return;
    }

    Linking.openURL(url).catch((err) =>
      console.error("Error opening WhatsApp:", err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      <SectionHeader title="Event Attender" />
      <View style={styles.badgesContainer}>
        {eventAttenderBadges.map((badge, index) => (
          <TouchableHighlight
            key={index}
            style={styles.badgeWrapper}
            underlayColor="transparent"
            onPress={() => handleBadgePress(badge)}
          >
            <View>
              <Image
                source={badge.image}
                style={[
                  styles.badgeImage,
                  badge.locked ? styles.lockedBadge : null,
                ]}
              />
              {badge.locked && (
                <Image source={lockIcon} style={styles.lockIcon} />
              )}
              <Text style={styles.badgeLabel}>{badge.name}</Text>
              <Text style={styles.badgeLevel}>{badge.level}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </View>

      <SectionHeader title="Impact Investor" />
      <View style={styles.badgesContainer}>
        {impactInvestorBadges.map((badge, index) => (
          <TouchableHighlight
            key={index}
            style={styles.badgeWrapper}
            underlayColor="transparent"
            onPress={() => handleBadgePress(badge)}
          >
            <View>
              <Image
                source={badge.image}
                style={[
                  styles.badgeImage,
                  badge.locked ? styles.lockedBadge : null,
                ]}
              />
              {badge.locked && (
                <Image source={lockIcon} style={styles.lockIcon} />
              )}
              <Text style={styles.badgeLabel}>{badge.name}</Text>
              <Text style={styles.badgeLevel}>{badge.level}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </View>

      {/* Modal */}
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
                source={selectedBadge.image}
                style={styles.modalBadgeImage}
              />
              <Text style={styles.modalBadgeLabel}>{selectedBadge.name}</Text>
              <Text style={styles.modalBadgeLevel}>{selectedBadge.level}</Text>
              {!selectedBadge.locked && (
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={shareBadge}
                >
                  <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
              )}
              <TouchableHighlight
                style={styles.closeButton}
                onPress={closeModal}
                underlayColor="#dddddd"
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableHighlight>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeWrapper: {
    width: "45%",
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
  },
  badgeImage: {
    marginLeft: 15,
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  badgeLabel: {
    marginTop: 5,
    fontSize: 16,
    textAlign: "center",
  },
  badgeLevel: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  lockedBadge: {
    opacity: 0.5,
  },
  lockIcon: {
    position: "absolute",
    top: "40%",
    left: "40%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
    width: 40,
    height: 40,
    resizeMode: "contain",
    zIndex: 1,
  },
  // Modal styles
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
    alignItems: "center",
  },
  modalBadgeImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  modalBadgeLabel: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalBadgeLevel: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  shareButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

export default RewardsSection;
