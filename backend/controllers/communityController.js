const Community = require("../models/Community");

exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch communities" });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: "Not found" });

    if (!community.members.includes(req.user.id)) {
      community.members.push(req.user.id);
      await community.save();
    }

    res.json({ message: "Joined community" });
  } catch (err) {
    res.status(500).json({ message: "Failed to join community" });
  }
};
