const User = require("../models/User");

// ADD / UPDATE READING STATUS
exports.updateReadingStatus = async (req, res) => {
  const { bookId, status } = req.body;

  const user = await User.findById(req.user._id);

  const existing = user.readingStatus.find(
    r => r.book.toString() === bookId
  );

  if (existing) {
    existing.status = status;
    if (status === "completed") {
      existing.completedAt = new Date();
    }
  } else {
    user.readingStatus.push({
      book: bookId,
      status,
      completedAt: status === "completed" ? new Date() : null
    });
  }

  await user.save();
  res.json({ message: "Reading status updated" });
};

// GET CURRENTLY READING
exports.getCurrentlyReading = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "readingStatus.book"
  );

  const reading = user.readingStatus.filter(
    r => r.status === "reading"
  );

  res.json(reading);
};

// GET COMPLETED BOOKS
exports.getCompletedBooks = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "readingStatus.book"
  );

  const completed = user.readingStatus.filter(
    r => r.status === "completed"
  );

  res.json(completed);
};

// SET READING GOALS
exports.setReadingGoals = async (req, res) => {
  const { monthly, yearly } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    readingGoals: { monthly, yearly }
  });

  res.json({ message: "Reading goals updated" });
};
