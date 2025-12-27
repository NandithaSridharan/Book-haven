const Review = require("../models/Review");
const Book = require("../models/Book");

const updateBookRating = async (bookId) => {
  const reviews = await Review.find({ book: bookId });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

  await Book.findByIdAndUpdate(bookId, {
    totalReviews,
    averageRating: Number(averageRating.toFixed(1))
  });
};

module.exports = updateBookRating;
