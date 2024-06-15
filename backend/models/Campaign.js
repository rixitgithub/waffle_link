// Import mongoose module
const mongoose = require("mongoose");

// Define schema for Campaign
const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["fundraising", "volunteer", "awareness"], // Assuming these are the types
    required: true,
  },
  goal: {
    type: Number, // Assuming fundraising goal is a number
    required: function () {
      return this.type === "fundraising"; // Required only if type is fundraising
    },
  },
  currency: {
    type: String,
    enum: ["USD", "EUR", "GBP", "INR"], // Example currencies
    required: function () {
      return this.type === "fundraising"; // Required only if type is fundraising
    },
  },
  endDate: {
    type: Date,
    required: true,
  },
  volunteerCount: {
    type: Number, // Number of volunteers needed
    required: function () {
      return this.type === "volunteer"; // Required only if type is volunteer
    },
  },
  skills: {
    type: [String], // Array of skills needed for volunteer campaigns
    required: function () {
      return this.type === "volunteer"; // Required only if type is volunteer
    },
  },
  shares: {
    type: Number, // Target shares for awareness campaigns
    required: function () {
      return this.type === "awareness"; // Required only if type is awareness
    },
  },
  likes: {
    type: Number, // Target likes for awareness campaigns
    required: function () {
      return this.type === "awareness"; // Required only if type is awareness
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Progress fields for each type of campaign
  progress: {
    fundraising: {
      currentAmount: {
        type: Number,
        default: 0,
      },
    },
    volunteer: {
      currentVolunteers: {
        type: Number,
        default: 0,
      },
    },
    awareness: {
      currentShares: {
        type: Number,
        default: 0,
      },
      currentLikes: {
        type: Number,
        default: 0,
      },
    },
  },
});

// Create and export Campaign model based on schema
module.exports = mongoose.model("Campaign", campaignSchema);
