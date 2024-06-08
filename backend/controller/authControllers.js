const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Register a new user
console.log("controller");
exports.register = async (req, res) => {
  console.log("ko");
  try {
    const { username, email, password } = req.body;
    // Hash the password
    console.log("hi");
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = new User({ username, email, password: hashedPassword });
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
    const { email, password } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
