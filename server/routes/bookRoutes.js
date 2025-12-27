const express = require("express");
const { searchBooks } = require("../controllers/bookController");
const router = express.Router();
const {
  addBook,
  getBooks,
  updateBook,
  deleteBook
} = require("../controllers/bookController");

const { protect } = require("../middleware/authMiddleware");
router.get("/search", searchBooks);
router.get("/", getBooks);
router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;
