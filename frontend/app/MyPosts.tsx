import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import moment from "moment";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

type Post = {
  id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
};

type Props = {
  posts: Post[];
};

const MyPosts: React.FC<Props> = ({ posts }) => {
  console.log("my posts", posts);

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postTime}>{moment(item.createdAt).fromNow()}</Text>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.images.length > 0 && (
        <Swiper style={styles.swiper}>
          {item.images.map((image, index) => (
            <View key={index}>
              <Pressable
                onPress={() => {
                  /* Implement image modal if needed */
                }}
              >
                <Image source={{ uri: image }} style={styles.postImage} />
              </Pressable>
            </View>
          ))}
        </Swiper>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.feedContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  feedContainer: {
    padding: 10,
  },
  postContainer: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postTime: {
    fontSize: 12,
    color: "#666",
  },
  postContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  swiper: {
    height: 200,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
});

export default MyPosts;
