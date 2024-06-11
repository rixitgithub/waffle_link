import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.0.2.2:4000";

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
