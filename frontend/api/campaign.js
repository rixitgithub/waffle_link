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

export const sendVolunteerRequest = async (requestData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      `${API_URL}/api/campaigns/send_volunteer_request`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include authorization header with token
        },
      }
    );
    console.log("message", response.data.message);
    return response.data.message;
  } catch (error) {
    console.error("Error sending request", error);
    throw error;
  }
};
export const getVolunteerRequest = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(
      `${API_URL}/api/campaigns/volunteer-requests`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include authorization header with token
        },
      }
    );
    console.log("message", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending request", error);
    throw error;
  }
};
