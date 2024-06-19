import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//const API_URL = "http://10.0.2.2:4000"; // Replace with your actual API URL
const API_URL = "http://localhost:4000";

export const createCampaign = async (campaignData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      `${API_URL}/api/campaigns/create`,
      campaignData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include authorization header with token
        },
      }
    );

    if (response.status !== 201) {
      throw new Error("Failed to create campaign");
    }

    return true; // Campaign created successfully
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};
