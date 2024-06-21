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
    const ngo = await NGO.findOne({ owner: userId });
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found for this user" });
    }
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
      ngoId: ngo._id,
    });

    // Save the new Campaign to the database
    const savedCampaign = await newCampaign.save();

    // Find the NGO associated with the user and update its campaigns array

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
    const campaigns = await Campaign.find()
      .sort({ createdAt: -1 }) // Sort by createdAt descending
      .populate({
        path: "ngoId", // Populate the ngoId field
        select: "name profilePhoto category", // Select fields to populate
      })
      .exec();

    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/send_volunteer_request", authMiddleware, async (req, res) => {
  const { campaignId, text } = req.body;
  const userId = req.user.id; // Assuming authMiddleware sets req.user with user ID

  try {
    // Find the campaign by campaignId
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Check if campaign type is "volunteer"
    if (campaign.type !== "volunteer") {
      return res
        .status(400)
        .json({ error: "Campaign is not a volunteer type" });
    }

    // Check if user has already volunteered
    const alreadyVolunteered =
      campaign.progress.volunteer.volunteer_request.some(
        (request) => request.user.toString() === userId
      );

    if (alreadyVolunteered) {
      return res
        .status(400)
        .json({ error: "You have already volunteered for this campaign" });
    }

    // Add the volunteer request to the campaign
    campaign.progress.volunteer.volunteer_request.push({
      user: userId,
      text,
    });

    // Save the updated campaign
    await campaign.save();

    res.status(200).json({ message: "Volunteer request sent successfully" });
  } catch (err) {
    console.error("Error volunteering for campaign:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
