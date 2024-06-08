const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Register a new user
// Register a new user
app.post("/api/users", async (req, res) => {
  try {
    console.log("hello");
    const {
      username,
      email,
      password,
      name,
      bio,
      profilePicture,
      location,
      website,
    } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      name,
      bio,
      profilePicture,
      location,
      website,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    console.log("this is the user", user);
    // If user is not found, return error
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    // If password is invalid, return error
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });
    console.log(token);
    // Return token in response
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login user
app.get("/posts/1", async (req, res) => {
  console.log("test");
  res.send("this is the text");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
