const express = require("express");
const Ngo = require("../models/NGO");
const authMiddleware = require("../middleware/authMiddleware"); // Import your auth middleware

const router = express.Router();

// POST endpoint to create a new NGO
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { userId } = req; // Extract userId from authenticated request

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

    // Query the NGO associated with the authenticated user and populate post details
    const ngo = await Ngo.findOne({ owner: userId }).populate("posts");

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found for this user" });
    }

    res.status(200).json(ngo);
  } catch (error) {
    console.error("Error fetching NGO details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
