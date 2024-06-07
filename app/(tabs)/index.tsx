// HomeScreen.tsx
import React, { useState } from "react";
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Banner from "../banner";
import { FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
const { width } = Dimensions.get("window");

interface Post {
  id: string;
  userImage: string;
  userName: string;
  postText: string;
  postImages: string[]; // Updated interface to include multiple post images
  views: number;
  likes: number;
  comments: number;
}

const dummyData: Post[] = [
  {
    id: "1",
    userImage: "https://via.placeholder.com/40",
    userName: "User One",
    postText: "Loving this view!",
    postImages: [
      "https://via.placeholder.com/700x400",
      "https://via.placeholder.com/600x400",
      "https://via.placeholder.com/600x400",
    ],
    views: 120,
    likes: 30,
    comments: 10,
  },
  {
    id: "2",
    userImage: "https://via.placeholder.com/40",
    userName: "User Two",
    postText: "Amazing sunset today.",
    postImages: ["https://via.placeholder.com/600x400"],
    views: 80,
    likes: 25,
    comments: 5,
  },
];

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigation = useNavigation();

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
            3 days ago
          </Text>
        </View>
      </View>
      <Text style={[styles.postText, { color: colors.text }]}>
        {item.postText}
      </Text>
      <Swiper style={styles.swiper}>
        {item.postImages.map((image, index) => (
          <View key={index}>
            <Pressable onPress={() => openImageModal(image)}>
              <Image source={{ uri: image }} style={styles.postImage} />
            </Pressable>
          </View>
        ))}
      </Swiper>
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
      <FlatList
        data={dummyData}
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
    color: Colors.text,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.inactive,
  },
  postText: {
    fontSize: 14,
    marginBottom: 10,
    color: Colors.text,
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
});

export default HomeScreen;
