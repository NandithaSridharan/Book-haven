const express = require("express");
const router = express.Router();
const {
  updateReadingStatus,
  getCurrentlyReading,
  getCompletedBooks,
  setReadingGoals
} = require("../controllers/readingController");

const { protect } = require("../middleware/authMiddleware");

router.post("/status", protect, updateReadingStatus);
router.get("/current", protect, getCurrentlyReading);
router.get("/completed", protect, getCompletedBooks);
router.post("/goals", protect, setReadingGoals);

module.exports = router;
