const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// Route to fetch all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("createdBy", "username");
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to fetch comments for a specific post by postId
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  console.log("postid", postId);
  try {
    const comments = await Comment.find({ postId }).populate(
      "userId",
      "username"
    );

    if (!comments || comments.length === 0) {
      return res.status(404).json({ error: "Comments not found" });
    }
    console.log("comments", comments);
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
