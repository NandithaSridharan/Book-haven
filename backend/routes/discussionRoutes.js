const express = require("express");
const router = express.Router();
const {
  getDiscussions,
  getDiscussionById,
  createDiscussion,
  addReply,
  toggleReplyLike,
  deleteDiscussion,
} = require("../controllers/discussionController");

const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/", getDiscussions);
router.get("/:id", getDiscussionById);

// Protected
router.post("/", protect, createDiscussion);
router.post("/:id/replies", protect, addReply);
router.post("/:discussionId/replies/:replyId/like", protect, toggleReplyLike);
router.delete("/:id", protect, deleteDiscussion);

module.exports = router;