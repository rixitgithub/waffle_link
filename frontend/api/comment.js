import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_URL = "http://localhost:4000";

export const fetchComments = async (postId) => {
  try {
    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    // Fetch comments for the given postId
    const response = await axios.get(`${API_URL}/api/comments/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
export const postComment = async (postId, commentText) => {
  try {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Set the token in the request headers
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Construct the request body
    const body = {
      postId,
      comment: commentText,
    };

    // Make the API request to post a comment
    const response = await axios.post(
      `${API_URL}/api/comments/create`,
      body,
      config
    );
    return response.data; // Assuming your backend returns some data after posting
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};
