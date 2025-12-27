const Book = require("../models/Book");

// ADD BOOK
exports.addBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      owner: req.user._id
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL BOOKS (PUBLIC)
exports.getBooks = async (req, res) => {
  const books = await Book.find().populate("owner", "name");
  res.json(books);
};

// UPDATE OWN BOOK
exports.updateBook = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  Object.assign(book, req.body);
  await book.save();

  res.json({ message: "Book updated", book });
};

// DELETE OWN BOOK
exports.deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await book.deleteOne();
  res.json({ message: "Book deleted" });
};
