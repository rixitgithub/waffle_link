import { useNavigation } from "@react-navigation/native";
import useUserAPI from "../api/user.js";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUserAPI(); // Use the user API hook

  const handleLogin = async () => {
    try {
      const userData = { email, password };
      const response = await login(userData);
      console.log("final", response);
      if (response.data.token) {
        // Assume the response contains the token
        const { token } = response.data;
        // Optionally, store the token (e.g., in AsyncStorage)
        // await AsyncStorage.setItem("token", token);

        // Navigate to the home screen or any other screen
        navigation.navigate("index");
      } else {
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    backgroundColor: "blue", // Customize button color if needed
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default LoginScreen;
