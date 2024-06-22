import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useNavigation } from "@react-navigation/native";
import { fetchNGOs } from "../../api/ngo"; // Import the fetch function

// Categories array
const categories = [
  { id: "all", name: "All" },
  { id: "health", name: "Health" },
  { id: "education", name: "Education" },
  { id: "environment", name: "Environment" },
  { id: "human_rights", name: "Human Rights" },
  { id: "disaster_relief", name: "Disaster Relief" },
  { id: "animal_welfare", name: "Animal Welfare" },
  { id: "arts_culture", name: "Arts & Culture" },
  { id: "sports", name: "Sports" },
  { id: "technology", name: "Technology" },
  { id: "economic_development", name: "Economic Development" },
  { id: "women_empowerment", name: "Women Empowerment" },
  { id: "child_welfare", name: "Child Welfare" },
  { id: "elderly_care", name: "Elderly Care" },
  { id: "housing", name: "Housing" },
  { id: "food_security", name: "Food Security" },
  { id: "mental_health", name: "Mental Health" },
  { id: "legal_aid", name: "Legal Aid" },
  { id: "labor_rights", name: "Labor Rights" },
  { id: "peace_building", name: "Peace Building" },
  { id: "community_development", name: "Community Development" },
  { id: "youth_development", name: "Youth Development" },
];

const CommunityScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState("all"); // State for selected category
  const [communities, setCommunities] = useState([]); // State for all communities
  const [filteredCommunities, setFilteredCommunities] = useState([]); // State for filtered communities
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    // Fetch communities from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const ngos = await fetchNGOs();
        setCommunities(ngos);
        setFilteredCommunities(ngos); // Initialize filtered data with all NGOs
      } catch (error) {
        console.error("Error fetching NGOs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    // Filter communities based on search query and selected category
    let filteredData = communities;

    // First filter based on selected category
    if (selectedCategory !== "all") {
      filteredData = filteredData.filter(
        (community) => community.category.toLowerCase() === selectedCategory
      );
    }

    // Then filter based on search query
    filteredData = filteredData.filter((community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredCommunities(filteredData);
  };

  useEffect(() => {
    handleSearch();
  }, [selectedCategory, searchQuery]);

  const handleCommunityPress = (id: string) => {
    // Navigate to the NGO details screen and pass the NGO id as a parameter
    navigation.navigate("UserDetailsScreen", { id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Input */}
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Search NGOs"
        placeholderTextColor={colors.inactive}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      {/* Filter by Category */}
      <View style={styles.filterContainer}>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === item.id && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === item.id && { color: colors.background },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryFilterContainer}
        />
      </View>

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      )}

      {/* List of NGOs */}
      {!loading && (
        <FlatList
          data={filteredCommunities}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.ngoItem,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handleCommunityPress(item._id.toString())}
            >
              <Image
                source={{ uri: item.profilePhoto }}
                style={styles.ngoImage}
              />
              <View style={styles.ngoTextContainer}>
                <Text style={[styles.ngoName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.ngoCategory, { color: colors.text }]}>
                  Category: {item.category}
                </Text>
                <Text style={[styles.ngoDescription, { color: colors.text }]}>
                  Mission: {item.missionStatement}
                </Text>
                <Text style={[styles.ngoContact, { color: colors.text }]}>
                  Contact: {item.contactInfo}
                </Text>
                <Text style={[styles.ngoEstablished, { color: colors.text }]}>
                  Established:{" "}
                  {new Date(item.establishedDate).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  filterContainer: {
    marginBottom: 10,
  },
  categoryFilterContainer: {
    alignItems: "center",
  },
  filterButton: {
    marginLeft: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 12,
  },
  loader: {
    marginTop: 20,
  },
  ngoItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  ngoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  ngoTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  ngoName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  ngoCategory: {
    fontSize: 14,
  },
  ngoDescription: {
    fontSize: 14,
  },
  ngoContact: {
    fontSize: 14,
  },
  ngoEstablished: {
    fontSize: 14,
  },
});

export default CommunityScreen;
