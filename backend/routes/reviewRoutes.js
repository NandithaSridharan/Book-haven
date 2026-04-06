const express = require("express");
const router = express.Router();
const {
  addReview,
  getBookReviews,
  toggleLikeReview
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// Reviews for a book
router.post("/:bookId", protect, addReview);
router.get("/:bookId", getBookReviews);

// Like review
router.post("/like/:reviewId", protect, toggleLikeReview);

module.exports = router;
