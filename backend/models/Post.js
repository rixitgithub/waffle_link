const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for comments
const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  writtenAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

// Define schema for Post
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of strings (URLs of images)
    default: [], // Default to an empty array
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming a User model exists with 'User' as the model name
    required: true,
  },
  upvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  ],
  comments: [commentSchema], // Array of comments
  // You can add more fields as needed
});

// Create a model for the schema
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
