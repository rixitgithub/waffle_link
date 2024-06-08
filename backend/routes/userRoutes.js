// userRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User.js");

// GET route to fetch user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Extract user profile information from req.user
    const { username, email, profilePicture, location, website } = req.user;
    return res.status(200).json({
      username,
      email,
      profilePicture,
      location,
      website,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
