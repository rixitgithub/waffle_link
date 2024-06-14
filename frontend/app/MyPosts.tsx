import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import moment from "moment";

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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            {item.images.length > 0 && (
              <FlatList
                data={item.images}
                keyExtractor={(image) => image}
                horizontal
                renderItem={({ item: image }) => (
                  <Image source={{ uri: image }} style={styles.postImage} />
                )}
              />
            )}
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postTime}>
                {moment(item.createdAt).fromNow()}
              </Text>
              <Text>{item.content}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  postContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 15,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  postContent: {
    flex: 1,
    marginTop: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
});

export default MyPosts;
