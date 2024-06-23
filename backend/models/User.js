const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String },
  profilePicture: { type: String },
  location: { type: String },
  website: { type: String },
  money_donated: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  events_volunteered: { type: Number, default: 0 },
  event_attender_badges: [
    {
      name: { type: String, required: true },
      level: { type: String, required: true },
      locked: { type: Boolean, default: true },
      image: { type: String, required: true },
    },
  ],
  impact_investor_badges: [
    {
      name: { type: String, required: true },
      level: { type: String, required: true },
      locked: { type: Boolean, default: true },
      image: { type: String, required: true },
    },
  ],
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
