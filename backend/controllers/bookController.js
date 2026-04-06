const Book = require("../models/Book");

// GET all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().lean();

    const normalizedBooks = books.map((book) => ({
      ...book,
      genres: book.genres?.length ? book.genres : book.genre ? [book.genre] : [],
    }));

    res.json(normalizedBooks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

// GET single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch book" });
  }
};

// GET book by title (used by Books.jsx to check if a book already exists in DB)
// GET /api/books/search?title=...
exports.searchBookByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: "Title query is required" });
    }

    // Case-insensitive exact match
    const book = await Book.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
    });

    // Return null (not 404) so the frontend can distinguish "not found" from an error
    res.json(book || null);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

// POST create a new book (called by Books.jsx after fetching from Open Library)
// Requires auth — the logged-in user becomes the owner
exports.createBook = async (req, res) => {
  try {
    const { title, author, image, description, genres, tags } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    // Guard against duplicates (race condition if two tabs click at once)
    const existing = await Book.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
    });
    if (existing) return res.json(existing);

    const book = await Book.create({
      title,
      author,
      image: image || "",
      description: description || "",
      genres: genres || [],
      tags: tags || [],
      owner: req.user._id, // set from auth middleware
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};