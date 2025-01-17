const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment", // Reference to the Comment model
    },
  ],
  ngoId: {
    type: Schema.Types.ObjectId,
    ref: "NGO", // Reference to the NGO model
    required: true,
  },

  // You can add more fields as needed
});

// Create a model for the schema
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
