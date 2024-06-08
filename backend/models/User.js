const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String },
  profilePicture: { type: String }, // URL to profile picture
  location: { type: String }, // Location of the user
  website: { type: String }, // User's website URL
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who follow this user
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs whom this user follows
  joinedAt: { type: Date, default: Date.now }, // Date when the user joined
});

module.exports = mongoose.model("User", userSchema);
