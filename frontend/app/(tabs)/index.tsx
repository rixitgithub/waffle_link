import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFocusEffect } from "@react-navigation/native";
import Banner from "../banner";
import { FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { fetchPostsAndCampaigns } from "../../api/user"; // Import fetchPostsAndCampaigns

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
      console.log("inside i am");
      const { posts: fetchedPosts, campaigns: fetchedCampaigns } =
        await fetchPostsAndCampaigns();
      console.log("fetched posts", fetchedPosts);
      console.log("fetched campaigns ", fetchedCampaigns);
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

  const renderItem = ({ item }: { item: Post }) => (
    <View style={[styles.postContainer, { backgroundColor: colors.card }]}>
      <View style={styles.userContainer}>
        <Pressable onPress={() => openUserDetails(item.id)}>
          <Image source={{ uri: item.userImage }} style={styles.userImage} />
        </Pressable>

        <Pressable onPress={() => openUserDetails(item.id)}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {item.userName}
          </Text>
        </Pressable>
        <View>
          <Text style={[styles.timeAgo, { color: colors.inactive }]}>
            99 days ago
          </Text>
        </View>
      </View>
      <Text style={[styles.postText, { color: colors.text }]}>
        {item.postText}
      </Text>
      {item.postImages && item.postImages.length > 0 ? (
        <Swiper style={styles.swiper}>
          {item.postImages.map((image, index) => (
            <View key={index}>
              <Pressable onPress={() => openImageModal(image)}>
                <Image source={{ uri: image }} style={styles.postImage} />
              </Pressable>
            </View>
          ))}
        </Swiper>
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No images available</Text>
        </View>
      )}
      <View style={styles.postStats}>
        <View style={styles.statsLeft}>
          <FontAwesome
            name="eye"
            size={20}
            style={[styles.statIcon, { color: colors.inactive }]}
          />
          <Text style={[styles.statText, { color: colors.inactive }]}>
            {item.views}
          </Text>
          <FontAwesome
            name="heart"
            size={20}
            style={[styles.statIcon, { color: colors.inactive }]}
          />
          <Text style={[styles.statText, { color: colors.inactive }]}>
            {item.likes}
          </Text>
          <FontAwesome
            name="comment"
            size={20}
            style={[styles.statIcon, { color: colors.inactive }]}
          />
          <Text style={[styles.statText, { color: colors.inactive }]}>
            {item.comments}
          </Text>
        </View>
        <FontAwesome
          name="share"
          size={20}
          style={[styles.shareIcon, { color: colors.inactive }]}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Banner />
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
        renderItem={renderItem}
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
  postContainer: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.inactive,
  },
  postText: {
    fontSize: 14,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  statsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    marginRight: 5,
  },
  statText: {
    marginRight: 15,
    fontSize: 14,
  },
  shareIcon: {},
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: width * 0.9,
    height: width * 0.9,
  },
  swiper: {
    height: 200,
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
    borderColor: Colors.inactive,
  },
  activeToggleButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleButtonText: {
    fontSize: 16,
    color: Colors.inactive,
  },
  activeToggleButtonText: {
    color: Colors.background,
  },
});

export default HomeScreen;
