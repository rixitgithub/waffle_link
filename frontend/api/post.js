// api.js
const API_URL = "http://10.0.2.2:4000";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const createPost = async (postData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include authorization header with token
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    return true; // Post created successfully
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};
