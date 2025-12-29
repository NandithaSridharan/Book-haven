const express = require("express");
const router = express.Router();
const { authorize } = require("../middleware/roleMiddleware");

const {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
  searchBooks
} = require("../controllers/bookController");

const { protect } = require("../middleware/authMiddleware");

router.get("/search", searchBooks);
router.get("/", getBooks);
router.post("/", protect, authorize("admin"), addBook);
router.put("/:id", protect, authorize("admin"), updateBook);
router.delete("/:id", protect, authorize("admin"), deleteBook);


module.exports = router;
