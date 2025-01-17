import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//const API_URL = "http://10.0.2.2:4000"; // Replace with your actual API URL
//const API_URL = "http://localhost:4000";
const API_URL = "http://192.168.1.8:4000";

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

export const sendVolunteerRequestAction = async (
  campaignId,
  userId,
  actionType
) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.post(
      `${API_URL}/api/campaigns/volunteer-request-action`,
      { campaignId, userId, actionType },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // Include any necessary authorization headers here
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error ${actionType}ing volunteer request`, error);
    throw error;
  }
};
export const getVolunteerRecruited = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(
      `${API_URL}/api/campaigns/volunteer-recruited`,
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
export const getCampaignById = async (campaignId) => {
  try {
    const response = await axios.get(`${API_URL}/api/campaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign by id:", error);
    throw error; // Propagate the error back to the caller
  }
};
export const getCampaigns = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(
      `${API_URL}/api/campaigns/campaign/titles`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include authorization header with token
        },
      }
    );
    return response.data; // Assuming your API response contains the campaign data
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error; // Optionally handle or throw the error as needed
  }
};
export const saveUpdate = async (updateData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/campaigns/update`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error saving update:", error);
    throw error;
  }
};

export const Donate = async (campaignId, donationAmount) => {
  if (!donationAmount || isNaN(parseFloat(donationAmount))) {
    throw new Error("Invalid Donation Amount. Please enter a valid amount.");
  }

  const amount = parseFloat(donationAmount);

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.post(
      `${API_URL}/api/campaigns/campaign/donate`,
      {
        campaignId: campaignId,
        amount: amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.success) {
      throw new Error("Error donating. Please try again later.");
    }
    console.log("lets try", response.data);
    return { success: true, amount: amount, message: response.data.message };
  } catch (error) {
    console.error("Error donating:", error);
    throw new Error("Failed to process donation. Please try again later.");
  }
};
