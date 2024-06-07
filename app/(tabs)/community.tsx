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

// Mock data for communities (replace with actual data)
const mockCommunities = [
  {
    id: 1,
    name: "Community 1",
    description: "Description of Community 1",
    category: "Health",
    image: "https://via.placeholder.com/150", // Add image URL
  },
  {
    id: 2,
    name: "Community 2",
    description: "Description of Community 2",
    category: "Education",
    image: "https://via.placeholder.com/150", // Add image URL
  },
  // Add more community objects as needed
];

// Mock data for categories (replace with actual data)
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
  const [communities, setCommunities] = useState([]); // State for communities
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    // Simulate fetching communities from an API (replace with actual API call)
    setTimeout(() => {
      setCommunities(mockCommunities);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = () => {
    // Filter communities based on search query and selected category
    let filteredCommunities = mockCommunities.filter((community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedCategory !== "all") {
      filteredCommunities = filteredCommunities.filter(
        (community) => community.category.toLowerCase() === selectedCategory
      );
    }
    setCommunities(filteredCommunities);
  };

  useEffect(() => {
    handleSearch();
  }, [selectedCategory]);

  const handleCommunityPress = (userId) => {
    // Navigate to the user details screen and pass the community id as a parameter
    navigation.navigate("UserDetailsScreen", { userId });
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
        placeholder="Search Communities"
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

      {/* List of Communities */}
      {!loading && (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.communityItem,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handleCommunityPress(item.id)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.communityImage}
              />
              <View style={styles.communityTextContainer}>
                <Text style={[styles.communityName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text
                  style={[styles.communityDescription, { color: colors.text }]}
                >
                  {item.description}
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
    marginBottom: 10, // Adjust the margin bottom here
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
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  filterButtonText: {
    fontSize: 12,
    color: Colors.text,
  },
  loader: {
    marginTop: 20,
  },
  communityItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  communityImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  communityTextContainer: {
    justifyContent: "center",
  },
  communityName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  communityDescription: {
    color: Colors.text,
  },
});

export default CommunityScreen;
