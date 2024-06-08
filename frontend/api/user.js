// api.js

import axios from "axios";

const API_URL = "http://10.0.2.2:4000";

const useUserAPI = () => {
  const register = (userData) => {
    console.log(userData); // Log to indicate data being sent
    return axios
      .post(`${API_URL}/api/users/register`, userData)
      .then((response) => {
        console.log(response.data); // Log the response data

        return response.data;
      })
      .catch((error) => {
        console.error(error.response?.data?.message || "Something went wrong"); // Log the error message
        throw new Error(
          error.response?.data?.message || "Something went wrong"
        );
      });
  };

  const login = (userData) => {
    // Log to indicate data being sent
    return axios
      .post(`${API_URL}/api/users/login`, userData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error.response?.data?.message || "Something went wrong"); // Log the error message
        throw new Error(
          error.response?.data?.message || "Something went wrong"
        );
      });
  };

  const checkLoginStatus = (token) => {
    return axios
      .get(`${API_URL}/api/users/checkLoginStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data); // Log the response data
        return response.data.isLoggedIn; // Return the login status
      })
      .catch((error) => {
        console.error("Error checking login status:", error);
        return false; // Assume user is not logged in if an error occurs
      });
  };

  return { register, login, checkLoginStatus };
};

export default useUserAPI;
