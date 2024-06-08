const mongoose = require("mongoose");
const { Schema } = mongoose;

const ngoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  establishedDate: {
    type: Date,
    required: true,
  },
  missionStatement: {
    type: String,
    required: true,
  },
  contactInfo: {
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    website: { type: String },
  },
  founders: [
    {
      name: { type: String },
      role: { type: String },
    },
  ],
  projects: [
    {
      name: { type: String },
      description: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  ],
  members: [
    {
      name: { type: String },
      role: { type: String },
      joinDate: { type: Date },
    },
  ],
  fundingSources: [
    {
      source: { type: String },
      amount: { type: Number },
      dateReceived: { type: Date },
    },
  ],
  profilePhoto: {
    type: String,
    default: "defaultProfilePhotoUrl", // Replace with your default URL or leave it empty
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post", // Assuming you have a Post model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("NGO", ngoSchema);
