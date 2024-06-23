const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Register a new user
console.log("controller");
const eventAttenderBadges = [
  {
    name: "Bronze Badge",
    level: "Attended 3 Events",
    locked: true,
    image: "event_attender_1.png",
  },
  {
    name: "Silver Badge",
    level: "Attended 10 Events",
    locked: true,
    image: "event_attender_2.png",
  },
  {
    name: "Golden Badge",
    level: "Attended 25 Events",
    locked: true,
    image: "event_attender_3.png",
  },
  {
    name: "Platinum Badge",
    level: "Attended 50 Events",
    locked: true,
    image: "event_attender_4.png",
  },
  {
    name: "Diamond Badge",
    level: "Attended 100 Events",
    locked: true,
    image: "event_attender_5.png",
  },
];

const impactInvestorBadges = [
  {
    name: "Impact Bronze Badge",
    level: "Contributed $500",
    locked: true,
    image: "impact_investor_1.png",
  },
  {
    name: "Impact Silver Badge",
    level: "Contributed $1000",
    locked: true,
    image: "impact_investor_2.png",
  },
  {
    name: "Impact Golden Badge",
    level: "Contributed $5000",
    locked: true,
    image: "impact_investor_3.png",
  },
  {
    name: "Impact Platinum Badge",
    level: "Contributed $10000",
    locked: true,
    image: "impact_investor_4.png",
  },
  {
    name: "Impact Diamond Badge",
    level: "Contributed $50000",
    locked: true,
    image: "impact_investor_5.png",
  },
];

exports.register = async (req, res) => {
  try {
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

    // Create a new user with rewards initialization
    const user = new User({
      username,
      email,
      password: hashedPassword,
      name,
      bio,
      profilePicture,
      location,
      website,
      event_attender_badges: eventAttenderBadges,
      impact_investor_badges: impactInvestorBadges,
    });

    // Save the user to the database
    await user.save();

    // Respond with success message
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
