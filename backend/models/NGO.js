const mongoose = require("mongoose");
const { Schema } = mongoose;

const ngoSchema = new Schema({
  profilePhoto: String,
  name: { type: String, required: true },
  establishedDate: Date,
  missionStatement: String,
  contactInfo: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  founders: [
    {
      image: String,
      name: String,
      position: String,
    },
  ],
  category: String,
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
