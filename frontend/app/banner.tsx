// Banner.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const Banner: React.FC = () => {
  return (
    <View
      style={[styles.bannerContainer, { backgroundColor: Colors.light.card }]}
    >
      <Image
        source={require("../assets/images/logo_ngo.jpeg")}
        style={styles.ngoIcon}
      />
      <View style={styles.titleContainer}>
        <Text style={[styles.bannerText, { color: Colors.light.tint }]}>
          NGO Connect
        </Text>
      </View>
      <FontAwesome name="bookmark" size={24} color={Colors.light.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ngoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Banner;
