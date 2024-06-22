import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.8:4000";
//const API_URL = "http://10.0.2.2:4000";
//const API_URL = "http://localhost:4000";

export const submitNGOForm = async (formData) => {
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

    // Make the API request with the form data and token
    const response = await axios.post(
      `${API_URL}/api/ngo/create`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting form data:", error);
    throw error;
  }
};
export const fetchNGODetails = async () => {
  try {
    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    // Fetch NGO details using Axios directly
    const response = await axios.get(`${API_URL}/api/ngo/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching NGO details:", error);
    throw error;
  }
};
export const fetchNGOs = async () => {
  try {
    // Fetch NGO details using Axios directly
    const response = await axios.get(`${API_URL}/api/ngo/fetch`);
    console.log("ngos", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching NGO details:", error);
    throw error;
  }
};
export const fetchNGOById = async (id) => {
  try {
    // Fetch NGO details using Axios
    const response = await axios.post(`${API_URL}/api/ngo/fetchById`, { id });
    console.log("NGO details:", response.data);
    return response.data; // Return the fetched NGO details
  } catch (error) {
    console.error("Error fetching NGO details:", error);
    throw error;
  }
};
