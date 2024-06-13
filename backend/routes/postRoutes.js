const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");
const NGO = require("../models/NGO");

const router = express.Router();

// POST endpoint to create a new post
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { title, images, content } = req.body;

    // Create a new Post instance
    const newPost = new Post({
      title,
      images,
      content,
      createdBy: userId,
    });

    // Save the new Post to the database
    const savedPost = await newPost.save();

    // Find the NGO associated with the user and update its posts array
    const ngo = await NGO.findOne({ owner: userId });
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found for this user" });
    }

    ngo.posts.push(savedPost._id);
    await ngo.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
