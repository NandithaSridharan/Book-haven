const express = require("express");
const router = express.Router();
const {
  getCommunities,
  joinCommunity
} = require("../controllers/communityController");

router.get("/", getCommunities);
router.post("/:id/join", joinCommunity);

module.exports = router;
