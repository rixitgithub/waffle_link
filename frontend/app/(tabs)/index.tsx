import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useNavigation } from "@react-navigation/native";
import { fetchPostsAndCampaigns } from "../../api/user"; // Import fetchPostsAndCampaigns
import PostComponent from "../PostComponent"; // Import your PostComponent
import CampaignComponent from "../CampaignComponent"; // Import your CampaignComponent

const { width } = Dimensions.get("window");

interface Post {
  id: string;
  userImage: string;
  userName: string;
  postText: string;
  postImages: string[];
  views: number;
  likes: number;
  comments: number;
}

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [campaigns, setCampaigns] = useState<Post[]>([]);
  const [viewMode, setViewMode] = useState<"posts" | "campaigns">("posts");
  const navigation = useNavigation();

  useEffect(() => {
    fetchPostsAndCampaignsData();
  }, []);

  const fetchPostsAndCampaignsData = async () => {
    try {
      const { posts: fetchedPosts, campaigns: fetchedCampaigns } =
        await fetchPostsAndCampaigns();
      setPosts(fetchedPosts);
      setCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error("Error fetching posts and campaigns:", error);
      // Handle error state if needed
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const openUserDetails = (userId: string) => {
    navigation.navigate("UserDetailsScreen", { userId });
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <PostComponent
      item={item}
      colors={colors}
      openImageModal={openImageModal}
      openUserDetails={openUserDetails}
    />
  );

  const renderCampaignItem = ({ item }: { item: Post }) => (
    <CampaignComponent
      item={item}
      colors={colors}
      openImageModal={openImageModal}
      openUserDetails={openUserDetails}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "posts" && styles.activeToggleButton,
          ]}
          onPress={() => setViewMode("posts")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              viewMode === "posts" && styles.activeToggleButtonText,
            ]}
          >
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "campaigns" && styles.activeToggleButton,
          ]}
          onPress={() => setViewMode("campaigns")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              viewMode === "campaigns" && styles.activeToggleButtonText,
            ]}
          >
            Campaigns
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={viewMode === "posts" ? posts : campaigns}
        renderItem={viewMode === "posts" ? renderPostItem : renderCampaignItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContainer}
      />
      <Modal
        isVisible={selectedImage !== null}
        onBackdropPress={() => setSelectedImage(null)}
      >
        <View style={styles.modalContent}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feedContainer: {
    padding: 10,
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
  activeToggleButton: {
    backgroundColor: "blue", // Change to your active color
    borderColor: "blue", // Change to your active color
  },
  toggleButtonText: {
    fontSize: 16,
    color: "gray",
  },
  activeToggleButtonText: {
    color: "white", // Change to your active text color
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "90%",
    borderRadius: 10,
  },
});

export default HomeScreen;
