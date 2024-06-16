const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");
const NGO = require("../models/NGO");

const router = express.Router();

// POST endpoint to create a new post
router.post("/create", authMiddleware, async (req, res) => {
  try {
    console.log("post data", req.body);
    const userId = req.user._id;
    console.log("user", userId);
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
router.get("/get", async (req, res) => {
  console.log("hiccccc");
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort by createdAt descending
    console.log(posts);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/upvote", async (req, res) => {
  const { postId, userId } = req.body;

  try {
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    const hasUpvoted = post.upvotes.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      post = await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { upvotes: userId } },
        { new: true, runValidators: true }
      );
    } else {
      // Add upvote
      post = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { upvotes: userId } },
        { new: true, runValidators: true }
      );
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    if (error.name === "VersionError") {
      // Retry logic for version error
      try {
        let post = await Post.findById(postId);

        if (post.upvotes.includes(userId)) {
          post = await Post.findOneAndUpdate(
            { _id: postId },
            { $pull: { upvotes: userId } },
            { new: true, runValidators: true }
          );
        } else {
          post = await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { upvotes: userId } },
            { new: true, runValidators: true }
          );
        }

        return res.json(post);
      } catch (retryError) {
        console.error(retryError);
        res.status(500).send("Error upvoting post");
      }
    } else {
      res.status(500).send("Error upvoting post");
    }
  }
});

module.exports = router;
