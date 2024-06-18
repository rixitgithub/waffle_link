const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Assuming you have a Post model
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
