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

router.get("/volunteer-requests", async (req, res) => {
  try {
    const campaigns = await Campaign.find({ type: "volunteer" })
      .populate("ngoId")
      .populate({
        path: "progress.volunteer.volunteer_request.user",
        model: "User",
      });

    const campaignRequests = campaigns.map((campaign) => ({
      campaign: {
        _id: campaign._id,
        title: campaign.title,
        description: campaign.description,
        ngo: campaign.ngoId,
      },
      requests: campaign.progress.volunteer.volunteer_request.map(
        (request) => ({
          user: request.user,
          text: request.text,
        })
      ),
    }));

    res.json(campaignRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/volunteer-request-action", authMiddleware, async (req, res) => {
  const { campaignId, userId, actionType } = req.body;

  try {
    // Find the campaign
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Find the index of the volunteer request in the campaign
    const requestIndex =
      campaign.progress.volunteer.volunteer_request.findIndex(
        (request) => request.user.toString() === userId
      );

    if (requestIndex === -1) {
      return res.status(404).json({ message: "Volunteer request not found" });
    }

    // Handle accept/reject logic
    if (actionType === "accept") {
      // Add user to volunteer_recruited
      campaign.progress.volunteer.volunteer_recruited.push(userId);
      campaign.progress.volunteer.currentVolunteers += 1;
      // Remove user from volunteer_request
      campaign.progress.volunteer.volunteer_request.splice(requestIndex, 1);
    } else if (actionType === "reject") {
      // Remove user from volunteer_request
      campaign.progress.volunteer.volunteer_request.splice(requestIndex, 1);
    } else {
      return res.status(400).json({ message: "Invalid action type" });
    }

    // Save the campaign with updated request status
    await campaign.save();

    res.json({ message: `Request ${actionType}ed successfully` });
  } catch (error) {
    console.error("Error handling volunteer request action", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/volunteer-recruited", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    console.log("userId", userId);
    // Find the NGO by owner's userId
    const ngo = await NGO.findOne({ owner: userId });
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found for this owner" });
    }

    // Find campaigns of this NGO with type 'volunteer'
    const campaigns = await Campaign.find({ ngoId: ngo._id, type: "volunteer" })
      .populate("progress.volunteer.volunteer_recruited", "name email") // Populate recruited volunteers details
      .exec();
    console.log("campaigns", campaigns);
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns by NGO owner", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:campaignId", async (req, res) => {
  const { campaignId } = req.params;
  try {
    const campaign = await Campaign.findById(campaignId)
      .populate({
        path: "progress.fundraising.donors.user",
        select: "name email",
      })
      .populate({
        path: "progress.volunteer.volunteer_recruited",
        select: "name email profilePicture bio",
      })
      .exec();

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    console.log("campaigns", campaign.progress.volunteer.volunteer_recruited);
    res.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/campaign/titles", authMiddleware, async (req, res) => {
  const userId = req.user.id; // Assuming req.user.id is set by authMiddleware

  try {
    // Fetch the NGO owned by the authenticated user
    const ngo = await NGO.findOne({ owner: userId });

    if (!ngo) {
      return res.status(404).json({ error: "No NGO found for this user" });
    }

    const ngoId = ngo._id; // Assuming ngo._id is the ObjectId of the NGO owned by the user

    // Find campaigns where ngoId matches the NGO owned by the user
    const campaigns = await Campaign.find({ ngoId }).select("title _id");

    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ error: "No campaigns found for this NGO" });
    }

    // Extract titles and IDs from campaigns and send as response
    const campaignData = campaigns.map((campaign) => ({
      id: campaign._id,
      title: campaign.title,
    }));
    console.log({ campaigns: campaignData });
    res.json({ campaigns: campaignData });
  } catch (error) {
    console.error("Error fetching campaign titles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/update", async (req, res) => {
  try {
    const { campaignId, header, images, latitude, longitude } = req.body;

    // Find the campaign by ID
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Create new update object
    const newUpdate = {
      header,
      images,
      mapDetails: {
        latitude,
        longitude,
        address: "", // You can add address if available
      },
    };

    // Push the new update to updates array
    campaign.updates.push(newUpdate);

    // Save the campaign with the new update
    await campaign.save();

    res.status(201).json({ message: "Update saved successfully" });
  } catch (error) {
    console.error("Error saving update:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/campaign/donate", authMiddleware, async (req, res) => {
  const { campaignId, amount } = req.body;
  const userId = req.user.id; // Extracted from authMiddleware

  if (!campaignId || !amount || isNaN(parseFloat(amount))) {
    return res.status(400).json({ message: "Invalid campaign ID or amount." });
  }

  try {
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    if (campaign.type !== "fundraising") {
      return res
        .status(400)
        .json({ message: "Campaign is not a fundraising type." });
    }

    // Check if the user has already donated
    const existingDonor = campaign.progress.fundraising.donors.find(
      (donor) => donor.user.toString() === userId
    );

    if (existingDonor) {
      // Update existing donor's amount
      existingDonor.amount += parseFloat(amount);
    } else {
      // Add new donor details
      campaign.progress.fundraising.donors.push({
        user: userId,
        amount: parseFloat(amount),
      });
    }

    // Update fundraising progress
    campaign.progress.fundraising.currentAmount += parseFloat(amount);

    await campaign.save();

    res
      .status(200)
      .json({ success: true, message: "Donation successful.", campaign });
  } catch (error) {
    console.error("Error handling donation:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
