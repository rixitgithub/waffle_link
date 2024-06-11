const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Adjust the path as necessary
const NGO = require("../models/NGO"); // Adjust the path as necessary

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Extract user profile information from req.user
    const { _id, username, email, profilePicture, location, website, bio } =
      req.user;

    // Check if the user is the owner of any NGO
    const ngoOwnership = await NGO.exists({ owner: _id });

    return res.status(200).json({
      username,
      email,
      profilePicture,
      location,
      website,
      bio,
      isNgoOwner: !!ngoOwnership, // Convert to boolean
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
