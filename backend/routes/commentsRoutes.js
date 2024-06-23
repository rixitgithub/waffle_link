const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/authMiddleware");

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

router.post("/create", authMiddleware, async (req, res) => {
  const { postId, comment } = req.body; // Assuming commentText is the text content of the comment
  const userId = req.user.id;
  console.log(postId, userId, comment);
  try {
    // Create a new comment instance
    const newComment = new Comment({
      userId,
      postId,
      comment,
    });

    // Save the comment to the database
    await newComment.save();

    // Update the corresponding Post document's comments array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
      updatedPost, // Optional: Send updatedPost data back to the client
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
});

module.exports = router;
