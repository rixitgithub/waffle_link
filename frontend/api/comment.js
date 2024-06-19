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

    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
