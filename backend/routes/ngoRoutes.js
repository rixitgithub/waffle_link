const express = require("express");
const Ngo = require("../models/NGO");
const authMiddleware = require("../middleware/authMiddleware"); // Import your auth middleware

const router = express.Router();

// POST endpoint to create a new NGO
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from authenticated request

    // Create a new NGO instance with owner set to userId
    const newNgo = new Ngo({
      ...req.body,
      owner: userId,
    });

    // Save the new NGO to the database
    const savedNgo = await newNgo.save();

    res.status(201).json(savedNgo);
  } catch (error) {
    console.error("Error creating NGO:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/details", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authMiddleware sets req.user with user details

    // Query the NGO associated with the authenticated user
    const ngo = await Ngo.findOne({ owner: userId })
      .populate("posts") // Populate posts
      .populate("campaigns"); // Populate campaigns

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found for this user" });
    }

    res.status(200).json(ngo);
  } catch (error) {
    console.error("Error fetching NGO details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/fetch", async (req, res) => {
  try {
    const ngos = await Ngo.find();
    console.log("ngos", ngos);
    res.status(200).json(ngos);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching NGOs", error: err.message });
  }
});

router.post("/fetchById", async (req, res) => {
  const { id } = req.body;

  try {
    // Find the NGO by ID and populate posts and campaigns
    const ngo = await Ngo.findById(id)
      .populate("posts") // Assuming 'posts' is the field in your Ngo schema that references Post documents
      .populate("campaigns"); // Assuming 'campaigns' is the field in your Ngo schema that references Campaign documents

    if (!ngo) {
      return res.status(404).json({ error: "NGO not found" });
    }

    res.status(200).json(ngo);
  } catch (error) {
    console.error("Error fetching NGO details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
