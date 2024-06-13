import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

export default function YourNGO() {
  // Hardcoded NGO data
  const ngo = {
    profilePhoto: "https://example.com/profile-photo.jpg",
    name: "Sample NGO",
    missionStatement: "To make the world a better place.",
    contactInfo: "contact@samplengo.org",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      postalCode: "12345",
      country: "Country",
    },
    founders: [
      {
        image: "https://example.com/founder1.jpg",
        name: "John Doe",
        position: "Founder",
      },
      {
        image: "https://example.com/founder2.jpg",
        name: "Jane Smith",
        position: "Co-Founder",
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: ngo.profilePhoto }} style={styles.profilePhoto} />
      <Text style={styles.name}>{ngo.name}</Text>
      <Text style={styles.missionStatement}>{ngo.missionStatement}</Text>
      <Text style={styles.heading}>Contact Information:</Text>
      <Text>{ngo.contactInfo}</Text>
      <Text style={styles.heading}>Address:</Text>
      <Text>{`${ngo.address.street}, ${ngo.address.city}, ${ngo.address.state}, ${ngo.address.postalCode}, ${ngo.address.country}`}</Text>
      <Text style={styles.heading}>Founders:</Text>
      {ngo.founders.map((founder, index) => (
        <View key={index} style={styles.founder}>
          {founder.image && (
            <Image
              source={{ uri: founder.image }}
              style={styles.founderImage}
            />
          )}
          <View>
            <Text style={styles.founderName}>{founder.name}</Text>
            <Text>{founder.position}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  missionStatement: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  founder: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  founderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  founderName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
