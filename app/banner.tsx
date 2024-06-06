import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Banner: React.FC = () => {
  return (
    <View style={styles.bannerContainer}>
      <Image
        source={require("../assets/images/logo_ngo.jpeg")} // Add your NGO icon/image
        style={styles.ngoIcon}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.bannerText}>NGO Connect</Text>
      </View>
      <FontAwesome name="bookmark" size={24} color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: "#00796B", // Deep Green
    paddingTop: 40, // Add margin from the top
    paddingBottom: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ngoIcon: {
    width: 50,
    height: 50,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  bannerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Banner;
