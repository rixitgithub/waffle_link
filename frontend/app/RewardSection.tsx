import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

const badgeImages = [
  require("../assets/images/event_attender_5.png"),
  require("../assets/images/event_attender_4.png"),
  require("../assets/images/event_attender_3.png"),
  require("../assets/images/event_attender_2.png"),
  require("../assets/images/event_attender_1.png"),
];

const badges = [
  { image: badgeImages[0], name: "Bronze Badge" },
  { image: badgeImages[1], name: "Silver Badge" },
  { image: badgeImages[2], name: "Gold Badge" },
  { image: badgeImages[3], name: "Platinum Badge" },
  { image: badgeImages[4], name: "Diamond Badge" },
];

const RewardsSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rewards</Text>
      <ScrollView contentContainerStyle={styles.badgesContainer}>
        {badges.map((badge, index) => (
          <View key={index} style={styles.badgeWrapper}>
            <Image source={badge.image} style={styles.badgeImage} />
            <Text style={styles.badgeLabel}>{badge.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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
});

export default RewardsSection;
