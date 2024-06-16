import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

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

const eventAttenderBadges = [
  {
    image: eventAttenderBadgeImages[0],
    name: "Bronze Badge",
    level: "Attended 3 Events",
  },
  {
    image: eventAttenderBadgeImages[1],
    name: "Silver Badge",
    level: "Attended 10 Events",
  },
  {
    image: eventAttenderBadgeImages[2],
    name: "Golden Badge",
    level: "Attended 25 Events",
  },
  {
    image: eventAttenderBadgeImages[3],
    name: "Platinum Badge",
    level: "Attended 50 Events",
  },
  {
    image: eventAttenderBadgeImages[4],
    name: "Diamond Badge",
    level: "Attended 100 Events",
  },
];

const impactInvestorBadges = [
  {
    image: impactInvestorBadgeImages[0],
    name: "Impact Bronze Badge",
    level: "Contributed $500",
  },
  {
    image: impactInvestorBadgeImages[1],
    name: "Impact Silver Badge",
    level: "Contributed $1000",
  },
  {
    image: impactInvestorBadgeImages[2],
    name: "Impact Golden Badge",
    level: "Contributed $5000",
  },
  {
    image: impactInvestorBadgeImages[3],
    name: "Impact Platinum Badge",
    level: "Contributed $10000",
  },
  {
    image: impactInvestorBadgeImages[4],
    name: "Impact Diamond Badge",
    level: "Contributed $50000",
  },
];

const RewardsSection = () => {
  return (
    <ScrollView style={styles.container}>
      <SectionHeader title="Event Attender" />
      <View style={styles.badgesContainer}>
        {eventAttenderBadges.map((badge, index) => (
          <View key={index} style={styles.badgeWrapper}>
            <Image source={badge.image} style={styles.badgeImage} />
            <Text style={styles.badgeLabel}>{badge.name}</Text>
            <Text style={styles.badgeLevel}>{badge.level}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Impact Investor" />
      <View style={styles.badgesContainer}>
        {impactInvestorBadges.map((badge, index) => (
          <View key={index} style={styles.badgeWrapper}>
            <Image source={badge.image} style={styles.badgeImage} />
            <Text style={styles.badgeLabel}>{badge.name}</Text>
            <Text style={styles.badgeLevel}>{badge.level}</Text>
          </View>
        ))}
      </View>
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
  },
  badgeImage: {
    width: 100,
    height: 100,
    resizeMode: "contain", // Ensure the image fits within the specified dimensions
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
});

export default RewardsSection;
