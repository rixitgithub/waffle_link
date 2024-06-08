const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Register a new user
console.log("controller");
exports.register = async (req, res) => {
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
};

// Login user
exports.loginUser = async (req, res) => {
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
};
