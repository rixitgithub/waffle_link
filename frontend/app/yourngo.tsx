import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { fetchNGODetails } from "../api/ngo"; // Adjust the path as needed

type NGO = {
  profilePhoto: string;
  name: string;
  missionStatement: string;
  contactInfo: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  founders: {
    image: string;
    name: string;
    position: string;
  }[];
};

export default function YourNGO() {
  const [ngo, setNGO] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNGODetails = async () => {
      try {
        const data = await fetchNGODetails();
        console.log("this is the ngo", data);
        setNGO(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getNGODetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error fetching NGO details. Please try again later.
        </Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!ngo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No NGO details available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {ngo.profilePhoto && (
        <Image source={{ uri: ngo.profilePhoto }} style={styles.profilePhoto} />
      )}
      {ngo.name && <Text style={styles.name}>{ngo.name}</Text>}
      {ngo.missionStatement && (
        <Text style={styles.missionStatement}>{ngo.missionStatement}</Text>
      )}
      <Text style={styles.heading}>Contact Information:</Text>
      {ngo.contactInfo && <Text>{ngo.contactInfo}</Text>}
      <Text style={styles.heading}>Address:</Text>
      {ngo.address && (
        <Text>{`${ngo.address.street}, ${ngo.address.city}, ${ngo.address.state}, ${ngo.address.postalCode}, ${ngo.address.country}`}</Text>
      )}
      <Text style={styles.heading}>Founders:</Text>
      {ngo.founders &&
        ngo.founders.map((founder, index) => (
          <View key={index} style={styles.founder}>
            {founder.image && (
              <Image
                source={{ uri: founder.image }}
                style={styles.founderImage}
              />
            )}
            <View>
              {founder.name && (
                <Text style={styles.founderName}>{founder.name}</Text>
              )}
              {founder.position && <Text>{founder.position}</Text>}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
