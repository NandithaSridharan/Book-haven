const Discussion = require("../models/Discussion");

// GET all discussions (with optional category/search filter)
exports.getDiscussions = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }
    if (search) {
      query.$text = { $search: search };
    }

    const discussions = await Discussion.find(query)
      .populate("author", "name profileImage")
      .sort({ isPinned: -1, createdAt: -1 })
      .lean();

    // Add reply count for list view
    const result = discussions.map((d) => ({
      ...d,
      replyCount: d.replies?.length || 0,
      replies: undefined, // don't send full replies in list
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch discussions" });
  }
};

// GET single discussion with all replies
exports.getDiscussionById = async (req, res) => {
  try {
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name profileImage")
      .populate("replies.author", "name profileImage");

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch discussion" });
  }
};

// POST create new discussion
exports.createDiscussion = async (req, res) => {
  try {
    const { title, category, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const discussion = await Discussion.create({
      title,
      category: category || "General",
      tags: tags || [],
      author: req.user._id,
    });

    await discussion.populate("author", "name profileImage");
    res.status(201).json(discussion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add a reply to a discussion
exports.addReply = async (req, res) => {
  try {
    const { text, isAI } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    discussion.replies.push({
      author: req.user._id,
      text,
      isAI: isAI || false,
    });

    await discussion.save();
    await discussion.populate("replies.author", "name profileImage");

    const newReply = discussion.replies[discussion.replies.length - 1];
    res.status(201).json(newReply);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST toggle like on a reply
exports.toggleReplyLike = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.discussionId);
    if (!discussion) return res.status(404).json({ message: "Discussion not found" });

    const reply = discussion.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const liked = reply.likes.includes(req.user._id);
    if (liked) {
      reply.likes.pull(req.user._id);
    } else {
      reply.likes.push(req.user._id);
    }

    await discussion.save();
    res.json({ liked: !liked, likeCount: reply.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a discussion (author or admin only)
exports.deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: "Not found" });

    const isOwner = discussion.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await discussion.deleteOne();
    res.json({ message: "Discussion deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};