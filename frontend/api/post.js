import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.8:4000";
//const API_URL = "http://10.0.2.2:4000";
//const API_URL = "http://localhost:4000";

export const createPost = async (postData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(`${API_URL}/api/posts/create`, postData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include authorization header with token
      },
    });

    if (response.status !== 201) {
      throw new Error("Failed to create post");
    }

    return true; // Post created successfully
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const upvotePost = async (postId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.post(
      `${API_URL}/api/posts/upvote`,
      { postId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    );
    return response.data; // Assuming the backend returns some data
  } catch (error) {
    console.error("Failed to upvote:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
