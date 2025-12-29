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

// SEARCH, FILTER, SORT, PAGINATE
exports.searchBooks = async (req, res) => {
  try {
    const {
      search,
      genre,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // 🔍 Search by title or author
    if (search) {
      query.$text = { $search: search };
    }

    // 🎭 Filter by genre
    if (genre) {
      query.genres = genre;
    }

    // ↕️ Sorting
    let sortOption = {};
    if (sort === "rating") {
      sortOption.averageRating = -1;
    } else if (sort === "popular") {
      sortOption.totalReviews = -1;
    } else {
      sortOption.createdAt = -1; // default: newest
    }

    // 📄 Pagination
    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate("owner", "name");

    const total = await Book.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      books
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
