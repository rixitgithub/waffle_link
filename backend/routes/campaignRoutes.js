// routes/campaignRoutes.js

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Campaign = require("../models/Campaign");
const NGO = require("../models/NGO");

const router = express.Router();

// POST endpoint to create a new campaign
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user contains authenticated user's data
    const {
      title,
      description,
      type,
      goal,
      currency,
      endDate,
      volunteerCount,
      skills,
      shares,
      likes,
    } = req.body;

    // Create a new Campaign instance
    const newCampaign = new Campaign({
      title,
      description,
      type,
      goal,
      currency,
      endDate,
      volunteerCount,
      skills,
      shares,
      likes,
      createdBy: userId,
    });

    // Save the new Campaign to the database
    const savedCampaign = await newCampaign.save();

    // Find the NGO associated with the user and update its campaigns array
    const ngo = await NGO.findOne({ owner: userId });
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found for this user" });
    }

    ngo.campaigns.push(savedCampaign._id);
    await ngo.save();

    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }); // Sort by createdAt descending
    console.log(campaigns);
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
