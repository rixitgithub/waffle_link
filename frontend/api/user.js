import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//const API_URL = "http://10.0.2.2:4000";
const API_URL = "http://localhost:4000";

export const fetchUserProfile = async () => {
  try {
    console.log("hi");
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile photo:", error);
    throw error;
  }
};

export const fetchPostsAndCampaigns = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const [postsResponse, campaignsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/posts/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${API_URL}/api/campaigns/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const postsData = postsResponse.data;
      const campaignsData = campaignsResponse.data;
      console.log("post", postsData);
      console.log("campaign", campaignsData);
      return { posts: postsData, campaigns: campaignsData };
    }
    return { posts: [], campaigns: [] }; // Return empty arrays if no token
  } catch (error) {
    console.error("Error fetching posts and campaigns:", error);
    throw error;
  }
};
