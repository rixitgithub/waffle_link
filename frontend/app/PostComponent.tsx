import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Post } from "./HomeScreen"; // Import Post type if needed

interface PostComponentProps {
  item: Post;
  colors: any; // Adjust type as per your Colors definition
  openImageModal: (imageUrl: string) => void;
  openUserDetails: (userId: string) => void;
}

const PostComponent: React.FC<PostComponentProps> = ({
  item,
  colors,
  openImageModal,
  openUserDetails,
}) => {
  return (
    <View style={[styles.postContainer, { backgroundColor: colors.card }]}>
      <View style={styles.userContainer}>
        <Pressable onPress={() => openUserDetails(item.createdBy)}>
          <Image source={{ uri: item.images[0] }} style={styles.userImage} />
        </Pressable>

        <Pressable onPress={() => openUserDetails(item.createdBy)}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {item.title}
          </Text>
        </Pressable>
        <View>
          <Text style={[styles.timeAgo, { color: colors.inactive }]}>
            {item.createdAt} {/* Format as needed */}
          </Text>
        </View>
      </View>
      <Text style={[styles.postText, { color: colors.text }]}>
        {item.content}
      </Text>
      {item.images && item.images.length > 0 ? (
        <Swiper style={styles.swiper}>
          {item.images.map((image, index) => (
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
            0 {/* Replace with actual views count */}
          </Text>
          <FontAwesome
            name="heart"
            size={20}
            style={[styles.statIcon, { color: colors.inactive }]}
          />
          <Text style={[styles.statText, { color: colors.inactive }]}>
            0 {/* Replace with actual likes count */}
          </Text>
          <FontAwesome
            name="comment"
            size={20}
            style={[styles.statIcon, { color: colors.inactive }]}
          />
          <Text style={[styles.statText, { color: colors.inactive }]}>
            0 {/* Replace with actual comments count */}
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
};

const styles = StyleSheet.create({
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
    color: "gray",
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
  noImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  noImageText: {
    fontSize: 16,
    color: "gray",
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
    color: "gray",
  },
  shareIcon: {},
  swiper: {
    height: 200,
  },
});

export default PostComponent;
