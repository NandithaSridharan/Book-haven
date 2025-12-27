const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["reader", "admin"],
      default: "reader"
    },
    bio: {
      type: String,
      default: ""
    },

    profileImage: {
      type: String,
      default: ""
    },
    interests: {
      type: [String], // genres
      default: []
    },

    wishlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
    ],

    readingHistory: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        status: {
          type: String,
          enum: ["reading", "completed"],
        },
        completedAt: Date
      }
    ],
    interests: {
      type: [String],
      default: []
    },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    profileImage: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }

);

module.exports = mongoose.model("User", userSchema);
