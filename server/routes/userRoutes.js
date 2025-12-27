const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  followUser
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.post("/follow/:id", protect, followUser);

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require("../controllers/userController");

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:bookId", protect, addToWishlist);
router.delete("/wishlist/:bookId", protect, removeFromWishlist);

module.exports = router;
