import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import useUserAPI from "../api/auth.js";

const CreateAccountScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // Changed to null initially
  const [location, setLocation] = useState(""); // Added location state
  const [website, setWebsite] = useState(""); // Added website state
  const navigation = useNavigation();
  const { register } = useUserAPI();

  // Function to handle image selection
  const handlePickImage = async () => {
    try {
      let permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        throw new Error("Permission to access camera roll is required!");
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.cancelled) {
        // Extract the image URI from the assets array
        const imageUri = pickerResult.assets[0].uri;
        setProfilePicture(imageUri);
        console.log("Selected image URI:", imageUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleCreateAccount = async () => {
    try {
      const userData = {
        username,
        email,
        password,
        name,
        bio,
        profilePicture,
        location, // Added location
        website, // Added website
      };
      console.log(userData);
      const newUser = await register(userData);
      console.log("User created:", newUser);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error creating user:", error.message);
      // Optionally, display an error message to the user
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create Account</Text>
      <TouchableOpacity onPress={handlePickImage}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageText}>Pick an Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Website"
        value={website}
        onChangeText={setWebsite}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Create Account</Text>
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
  loginButton: {
    position: "absolute",
    top: 30,
    left: 20,
    padding: 10,
    backgroundColor: "transparent",
  },
  loginButtonText: {
    fontSize: 16,
    color: "blue",
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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#cccccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageText: {
    fontSize: 16,
    color: "#ffffff",
  },
});

export default CreateAccountScreen;
