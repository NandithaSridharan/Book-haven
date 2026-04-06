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
  markAsRead,
  getWishlist,
  getDashboard
} = require("../controllers/userController");


router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:bookId", protect, addToWishlist);
router.post("/read/:bookId", protect, markAsRead);
router.get("/dashboard", protect, getDashboard);


router.delete("/wishlist/:bookId", protect, removeFromWishlist);

module.exports = router;
