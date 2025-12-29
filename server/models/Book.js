const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    genres: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    coverImage: {
      type: String,
      default: ""
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    availability: {
      type: String,
      enum: ["available", "lent"],
      default: "available"
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);
bookSchema.index({ title: "text", author: "text" });
bookSchema.index({ genres: 1 });
bookSchema.index({ averageRating: -1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ totalReviews: -1 });
module.exports = mongoose.model("Book", bookSchema);
