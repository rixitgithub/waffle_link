// src/api/user.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.0.2.2:4000";

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
