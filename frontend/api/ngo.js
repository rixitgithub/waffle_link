// api.js
import axios from "axios";

const API_URL = "http://10.0.2.2:4000";

export const submitNGOForm = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/ngo/create`, formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form data:", error);
    throw error;
  }
};
