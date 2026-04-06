const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true, trim: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isAI: { type: Boolean, default: false }, // flag for AI-generated suggestions
  },
  { timestamps: true }
);

const discussionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Recommendations", "Genre Talk", "Personal Picks", "Book Clubs", "Reviews", "General"],
      default: "General",
    },
    tags: { type: [String], default: [] },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [replySchema],
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

discussionSchema.index({ title: "text", tags: "text" });
discussionSchema.index({ category: 1 });
discussionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Discussion", discussionSchema);