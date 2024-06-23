const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Adjust the path as necessary
const NGO = require("../models/NGO");
const User = require("../models/User");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Extract user profile information from req.user
    const { _id, username, email, profilePicture, location, website, bio } =
      req.user;
    console.log({
      _id,
      username,
      email,
      profilePicture,
      location,
      website,
      bio,
    });
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

router.get("/rewards", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // Find user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract rewards details from user document
    const { event_attender_badges, impact_investor_badges } = user;

    // Prepare response object
    const rewardsDetails = {
      eventAttenderBadges: event_attender_badges,
      impactInvestorBadges: impact_investor_badges,
    };
    console.log("rewards", rewardsDetails);
    // Send response with rewards details
    res.status(200).json(rewardsDetails);
  } catch (error) {
    console.error("Error fetching rewards details:", error);
    res.status(500).json({ message: "Failed to fetch rewards details" });
  }
});
router.get("/leaderboard", authMiddleware, async (req, res) => {
  try {
    // Fetch all users sorted by score in descending order
    const users = await User.find({}, "name location score").sort({
      score: -1,
    });

    // Find current user's index in the sorted array
    const currentUserId = req.user.id; // Assuming authenticated user ID is available
    const currentUserIndex = users.findIndex(
      (user) => user._id.toString() === currentUserId
    );

    // Prepare response data with highlighted current user
    const leaderboardData = users.map((user, index) => ({
      ...user._doc,
      highlighted: index === currentUserIndex,
    }));
    console.log(leaderboardData);
    res.json(leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
