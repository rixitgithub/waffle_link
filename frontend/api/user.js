import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.8:4000";
//const API_URL = "http://10.0.2.2:4000";
//const API_URL = "http://localhost:4000";

export const fetchUserProfile = async () => {
  try {
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

export const fetchRewardsData = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_URL}/api/users/rewards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching rewards data:", error);
    throw error;
  }
};

export const fetchLeaderboardData = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_URL}/api/users/leadboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};
