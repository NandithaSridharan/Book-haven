const User = require("../models/User");

// GET PROFILE
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, interests } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (interests) user.interests = interests;

    await user.save();

    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.followUser = async (req, res) => {
  const userToFollow = await User.findById(req.params.id);

  if (!userToFollow) {
    return res.status(404).json({ message: "User not found" });
  }

  if (userToFollow.followers.includes(req.user._id)) {
    return res.status(400).json({ message: "Already following" });
  }

  userToFollow.followers.push(req.user._id);
  req.user.following.push(userToFollow._id);

  await userToFollow.save();
  await req.user.save();

  res.json({ message: "User followed" });
};
// ADD TO WISHLIST
exports.addToWishlist = async (req, res) => {
  if (req.user.wishlist.includes(req.params.bookId)) {
    return res.status(400).json({ message: "Already in wishlist" });
  }

  req.user.wishlist.push(req.params.bookId);
  await req.user.save();

  res.json({ message: "Book added to wishlist" });
};

// REMOVE FROM WISHLIST
exports.removeFromWishlist = async (req, res) => {
  req.user.wishlist = req.user.wishlist.filter(
    id => id.toString() !== req.params.bookId
  );

  await req.user.save();
  res.json({ message: "Book removed from wishlist" });
};

// GET WISHLIST
exports.getWishlist = async (req, res) => {
  const user = await req.user.populate("wishlist");
  res.json(user.wishlist);
};


