const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  searchBookByTitle,
  createBook,
} = require("../controllers/bookController");

const { protect } = require("../middleware/authMiddleware");

// IMPORTANT: /search must come before /:id so Express doesn't treat "search" as an ID
router.get("/search", searchBookByTitle);      // GET /api/books/search?title=...
router.get("/", getAllBooks);                   // GET /api/books
router.get("/:id", getBookById);               // GET /api/books/:id
router.post("/", protect, createBook);          // POST /api/books  (requires login)

module.exports = router;