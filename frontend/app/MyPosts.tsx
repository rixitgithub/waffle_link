// MyPosts.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

type Post = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
};

type Props = {
  posts: Post[];
};

const MyPosts: React.FC<Props> = ({ posts }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
            )}
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{item.title}</Text>
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  postImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postContent: {
    flex: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default MyPosts;
