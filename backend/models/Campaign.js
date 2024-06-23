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
    enum: ["fundraising", "volunteer", "awareness"],
    required: true,
  },
  goal: {
    type: Number,
    required: function () {
      return this.type === "fundraising";
    },
  },
  currency: {
    type: String,
    enum: ["USD", "EUR", "GBP", "INR"],
    required: function () {
      return this.type === "fundraising";
    },
  },
  endDate: {
    type: Date,
    required: true,
  },
  volunteerCount: {
    type: Number,
    required: function () {
      return this.type === "volunteer";
    },
  },
  skills: {
    type: [String],
    required: function () {
      return this.type === "volunteer";
    },
  },
  shares: {
    type: Number,
    required: function () {
      return this.type === "awareness";
    },
  },
  likes: {
    type: Number,
    required: function () {
      return this.type === "awareness";
    },
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  progress: {
    fundraising: {
      currentAmount: {
        type: Number,
        default: 0,
      },
      donors: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          amount: {
            type: Number,
            required: true,
          },
          usedFor: {
            type: String,
          },
        },
      ],
    },
    volunteer: {
      currentVolunteers: {
        type: Number,
        default: 0,
      },
      volunteer_request: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          text: {
            type: String,
            required: true,
          },
        },
      ],
      volunteer_recruited: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
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
  updates: [
    {
      header: {
        type: String,
        required: true,
      },
      images: {
        type: [String], // Array of image URLs
      },
      mapDetails: {
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
        address: {
          type: String,
        },
      },
      updatedAt: {
        // Add updatedAt field
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Create and export Campaign model based on schema
module.exports = mongoose.model("Campaign", campaignSchema);
