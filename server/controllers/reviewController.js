const Review = require("../models/Review");
const updateBookRating = require("../utils/updateBookRating");

// ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      book: req.params.bookId,
      rating,
      comment
    });

    await updateBookRating(req.params.bookId);

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You already reviewed this book" });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET REVIEWS FOR A BOOK
exports.getBookReviews = async (req, res) => {
  const reviews = await Review.find({ book: req.params.bookId })
    .populate("user", "name profileImage")
    .sort({ createdAt: -1 });

  res.json(reviews);
};

// LIKE / UNLIKE REVIEW
exports.toggleLikeReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const alreadyLiked = review.likes.includes(req.user._id);

  if (alreadyLiked) {
    review.likes.pull(req.user._id);
  } else {
    review.likes.push(req.user._id);
  }

  await review.save();
  res.json({ message: "Like updated" });
};
